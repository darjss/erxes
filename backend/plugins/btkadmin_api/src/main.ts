import { startPlugin } from 'erxes-api-shared/utils';
import resolvers from '~/apollo/resolvers';
import { typeDefs } from '~/apollo/typeDefs';
import { generateModels } from '~/connectionResolvers';
import { router } from '~/routes';

startPlugin({
  name: 'btkadmin',
  port: 33014,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  expressRouter: router,
  apolloServerContext: async (_subdomain, context) => {
    const models = await generateModels();

    context.models = models;

    return context;
  },
});
