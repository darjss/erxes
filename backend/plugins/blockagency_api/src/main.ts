import * as path from 'path';
import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { wrapMutationResolver } from '~/modules/admin/utils';
import { appRouter } from '~/trpc/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { router } from './routes';
import { permissions } from './modules/member/permissions';
startPlugin({
  name: 'blockagency',
  port: 33015,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers: {
      ...resolvers,
      Mutation: wrapMutationResolver(resolvers.Mutation),
    },
  }),
  expressRouter: router,
  hasSubscriptions: true,
  subscriptionPluginPath: path.resolve(
    __dirname,
    'apollo',
    process.env.NODE_ENV === 'production'
      ? 'subscription.js'
      : 'subscription.ts',
  ),
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
    permissions,
  },
});
