import {
  redis,
  startPlugin,
  getEnv,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { getSaasOrganizationIdBySubdomain } from 'erxes-api-shared/utils';
import resolvers from '~/apollo/resolvers';
import { typeDefs } from '~/apollo/typeDefs';
import { generateModels } from '~/connectionResolvers';
import { router } from '~/routes';
import {
  getOneFitMode,
  getOneFitInstanceId,
  getOneFitSecret,
  getOneFitMasterUrl,
  validateSlaveConfig,
  isSlaveMode,
} from '~/constants/mode';
import { getMasterClient } from '~/utils/masterClient';
import { graphqlProxyMiddleware } from '~/middlewares/graphqlProxyMiddleware';
import { initMQWorkers } from '~/worker';
import { IContext } from '~/connectionResolvers';
import {
  activateMembershipPurchase,
  isCreditOnlyPlan,
} from '@/membership/graphql/resolvers/utils/membershipPurchase';

validateSlaveConfig();

const DOMAIN = getEnv({ name: 'DOMAIN' });
const ALLOWED_ORIGINS = getEnv({ name: 'ALLOWED_ORIGINS' });

const corsOptions = {
  credentials: true,
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      DOMAIN,
      ...(ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : []),
    ].filter(Boolean);

    // Allow if origin matches any allowed origin or is a subdomain pattern
    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === 'string') {
        return (
          origin === allowed ||
          origin.includes(
            allowed.replace('http://', '').replace('https://', ''),
          )
        );
      }
      return false;
    });

    // Allow all origins for now - can be tightened based on requirements
    callback(null, true);
  },
};

startPlugin({
  name: 'onefit',
  port: 33013,
  corsOptions,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  expressRouter: router,
  middlewares: [graphqlProxyMiddleware],
  onServerInit: async () => {
    await initMQWorkers(redis);
  },
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
      instanceId = isSlaveMode()
        ? await getOneFitInstanceId(subdomain)
        : instanceIdFromHeader;
    }

    const masterClient = isSlaveMode() ? getMasterClient() : undefined;
    const masterUrl = getOneFitMasterUrl();

    context.models = models;
    context.mode = mode;
    context.instanceId = instanceId; // This will be set from header in master mode
    context.masterClient = masterClient;
    context.masterUrl = masterUrl;
    return context;
  },
  meta: {
    payments: {
      transactionCallback: async (subdomain, data) => {
        // Intentionally left blank.
        console.log('transactionCallback', subdomain, data);
      },
      callback: async (subdomain, data) => {
        const { contentTypeId, contentType, status } = data;

        // Only process membership purchase callbacks
        if (
          contentType !== 'onefit:membership:membershippurchase' &&
          contentType !== 'onefit:membershipPurchase'
        ) {
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

        if (membershipPurchase.promoCodeId) {
          await models.PromoCode.updateOne(
            { _id: membershipPurchase.promoCodeId },
            { $inc: { usedCount: 1 } },
          );
        }

        const plan = await models.MembershipPlan.findOne({
          _id: membershipPurchase.planId,
        });
        if (plan && isCreditOnlyPlan(plan)) {
          await activateMembershipPurchase(membershipPurchase._id, {
            models,
            subdomain,
          } as IContext);
        }

        const cpUserId = data.data?.cpUserId;
        const clientPortalId = data.data?.clientPortalId;
        if (cpUserId && clientPortalId) {
          const planName = plan?.name ?? 'membership';
          await sendTRPCMessage({
            subdomain,
            pluginName: 'core',
            method: 'mutation',
            module: 'cpNotifications',
            action: 'create',
            input: {
              cpUserIds: [cpUserId],
              clientPortalId,
              data: {
                title: 'Төлбөр хүлээн авлаа',
                message: `Таны "${planName}" гишүүнчлэлийн төлбөр амжилттай төлөгдлөө.`,
                type: 'success',
                contentType:
                  data.contentType ?? 'onefit:membership:membershippurchase',
                contentTypeId: contentTypeId,
              },
            },
            defaultValue: null,
          });
        }
      },
    },
  },
});
