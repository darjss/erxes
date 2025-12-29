import { startPlugin } from 'erxes-api-shared/utils';
import resolvers from '~/apollo/resolvers';
import { typeDefs } from '~/apollo/typeDefs';
import { generateModels } from '~/connectionResolvers';
import { router } from '~/routes';
import {
  getOneFitMode,
  getOneFitInstanceId,
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
});
