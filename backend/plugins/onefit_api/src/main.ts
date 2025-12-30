import { redis, startPlugin } from 'erxes-api-shared/utils';
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
import {
  CreditSource,
  CreditTransactionType,
} from './modules/membership/@types/credittransaction';

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

    // In slave mode, use environment variable
    // In master mode, use instanceId from header if present (from slave request)
    const instanceId = isSlaveMode()
      ? getOneFitInstanceId()
      : instanceIdFromHeader;

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
        console.log('callback', subdomain, data);
        const { contentTypeId, contentType, status, customerId } = data;
        // if (contentType !== 'credittransaction' || status !== 'paid') {
        //   return;
        // }
        const models = await generateModels(subdomain);
        const membershipPlan = await models.MembershipPlan.findOne({
          _id: contentTypeId,
        });
        if (!membershipPlan) {
          return;
        }
        const abc = await models.CreditTransaction.createTransaction({
          // _id: contentTypeId,
          userId: customerId,
          amount: membershipPlan.creditAmount,
          transactionType: CreditTransactionType.PURCHASE,
          source: CreditSource.INDIVIDUAL,
          balanceAfter: membershipPlan.creditAmount,
        });
        console.log('abc', abc);
      },
    },
  },
});
