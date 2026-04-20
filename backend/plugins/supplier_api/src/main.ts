import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/trpc/init-trpc';
import { wrapMutationResolver } from '~/modules/admin/utils';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { router } from './routes';
import { afterProcess } from './meta/afterProcess';

startPlugin({
  name: 'supplier',
  port: 33013,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers: {
      ...resolvers,
      Mutation: {
        // Supplier profile mutations — auto-send webhook to mushop on each call
        ...wrapMutationResolver(resolvers.WrappedMutation),
        // Submission mutations — handle their own webhooks manually
        ...resolvers.DirectMutation,
      },
    },
  }),
  expressRouter: router,
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
