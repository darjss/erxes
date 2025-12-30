import { redis, startPlugin, getEnv } from 'erxes-api-shared/utils';
import { getSaasOrganizationIdBySubdomain } from 'erxes-api-shared/utils/saas';
import resolvers from '~/apollo/resolvers';
import { typeDefs } from '~/apollo/typeDefs';
import { generateModels } from '~/connectionResolvers';
import { router } from '~/routes';
import {
  getOneFitMode,
  getOneFitInstanceId,
  getOneFitSecret,
  validateSlaveConfig,
  isSlaveMode,
} from '~/constants/mode';
import { getMasterClient } from '~/utils/masterClient';
import { graphqlProxyMiddleware } from '~/middlewares/graphqlProxyMiddleware';

validateSlaveConfig();

startPlugin({
  name: 'onefit',
  port: 33013,

  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  expressRouter: router,
  middlewares: [graphqlProxyMiddleware],
  apolloServerContext: async (subdomain, context, req, res) => {
    const models = await generateModels(subdomain);
    const mode = getOneFitMode();
    if (mode === 'master') {
      // until app token is implemented
      redis.set(
        `user_token_s68ZFqvF1hm-FqufRFcFD_${getOneFitSecret()}`,
        1,
        'EX',
        24 * 60 * 60,
      );
    }
    // Extract instanceId from header (when request comes from slave)
    const instanceIdFromHeader = req.headers['x-onefit-instance-id'] as
      | string
      | undefined;

    const VERSION = getEnv({ name: 'VERSION', defaultValue: 'os' });
    let instanceId: string | undefined;

    // In SaaS version, use organization ID as instanceId
    if (VERSION === 'saas') {
      try {
        instanceId = await getSaasOrganizationIdBySubdomain(subdomain);
      } catch (error) {
        console.error('Failed to get organization ID for SaaS:', error);
      }
    } else {
      // In slave mode, use environment variable
      // In master mode, use instanceId from header if present (from slave request)
      instanceId = isSlaveMode() ? getOneFitInstanceId() : instanceIdFromHeader;
    }

    const masterClient = isSlaveMode() ? getMasterClient() : undefined;

    context.models = models;
    context.mode = mode;
    context.instanceId = instanceId; // This will be set from header in master mode
    context.masterClient = masterClient;
    console.log('context', context);
    return context;
  },
  meta: {
    payments: {
      transactionCallback: async (subdomain, data) => {
        console.log('transactionCallback', subdomain, data);
      },
      callback: async (subdomain, data) => {
        const { contentTypeId, contentType, status, customerId } = data;

        // Only process membership purchase callbacks
        if (contentType !== 'onefit:membership:membershippurchase') {
          return;
        }

        // Only process paid status
        if (status !== 'paid') {
          return;
        }

        const models = await generateModels(subdomain);

        // Find the membership purchase
        const membershipPurchase = await models.MembershipPurchase.findOne({
          _id: contentTypeId,
        });

        if (!membershipPurchase) {
          return;
        }

        // Update purchase status to paid
        await models.MembershipPurchase.markAsPaid(membershipPurchase._id);
      },
    },
  },
});
