import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/trpc/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import automations from './meta/automations';
import segments from './meta/segments';
import { permissions } from './meta/permissions';
import { createLoaders } from './modules/car/graphql/resolvers/loaders';

startPlugin({
  name: 'car',
  port: 33016,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain, context);

    context.models = models;
    context.loaders = createLoaders(subdomain, models);

    return context;
  },
  trpcAppRouter: {
    router: appRouter,
    createContext: async (subdomain, context) => {
      const models = await generateModels(subdomain, context);

      context.models = models;

      return context;
    },
  },
  meta: {
    automations,
    segments,
    permissions,
    tags: {
      types: [{ type: 'car', description: 'Cars' }],
    },
    properties: {
      types: [{ type: 'car', description: 'Cars' }],
    },
  },
});
