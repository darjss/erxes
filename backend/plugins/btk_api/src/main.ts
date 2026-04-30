import { startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { wrapMutationResolver } from '~/modules/admin/utils';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import { router } from './routes';

startPlugin({
  name: 'btk',
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
  expressRouter: router,
});
