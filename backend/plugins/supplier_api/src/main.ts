import { startPlugin, getEnv } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/trpc/init-trpc';
import { wrapMutationResolver } from '~/modules/admin/utils';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { afterProcess } from './meta/afterProcess';

startPlugin({
  name: 'supplier',
  port: 33013,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers: {
      ...resolvers,
      Mutation: wrapMutationResolver(resolvers.Mutation),
    },
  }),
  apolloServerContext: async (subdomain, context) => {
    const models = await generateModels(subdomain);

    context.models = models;

    return context;
  },
  trpcAppRouter: {
    router: appRouter,
    createContext: async (subdomain, context) => {
      const models = await generateModels(subdomain);

      context.models = models;

      return context;
    },
  },
  meta: {
    afterProcess,
  },
});
