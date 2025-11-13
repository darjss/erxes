import { startPlugin } from 'erxes-api-shared/utils';
import resolvers from '~/apollo/resolvers';
import { typeDefs } from '~/apollo/typeDefs';
import { generateModels } from '~/connectionResolvers';
import routes from '~/routes';

startPlugin({
  name: 'blockadmin',
  port: 33012,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
  }),
  apolloServerContext: async (_subdomain, context) => {
    const models = await generateModels();

    context.models = models;

    return context;
  },
  onServerInit: async (app) => {
    app.use(routes);
  },
});
