import { sendTRPCMessage, startPlugin } from 'erxes-api-shared/utils';
import { typeDefs } from '~/apollo/typeDefs';
import { appRouter } from '~/trpc/init-trpc';
import resolvers from './apollo/resolvers';
import { generateModels } from './connectionResolvers';
import router from './routes';

startPlugin({
  name: 'mushop',
  port: 33014,
  graphql: async () => ({
    typeDefs: await typeDefs(),
    resolvers,
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
    payments: {
      callback: async (subdomain, data) => {
        const { contentType, status } = data;

        console.log('data', JSON.stringify(data, null, 2));

        if (contentType !== 'mushop:subscription') {
          return;
        }

        if (status !== 'paid') {
          return;
        }

        const models = await generateModels(subdomain);

        const cpUser = await sendTRPCMessage({
          subdomain,
          pluginName: 'core',
          method: 'query',
          module: 'cpUsers',
          action: 'get',
          input: {
            id: data.data?.cpUserId,
            clientPortalId: data.data?.clientPortalId,
          },
        });

        console.log('cpUser', JSON.stringify(cpUser, null, 2));

        if (!cpUser) {
          return;
        }

        const existing =
          await models.CustomerSubscription.getActiveSubscription(cpUser._id);

        console.log('existing', JSON.stringify(existing, null, 2));

        if (existing) {
          await models.CustomerSubscription.extendSubscription(existing._id);
        } else {
          await models.CustomerSubscription.createSubscription({
            cpUserId: cpUser._id,
            erxesCustomerId: cpUser.erxesCustomerId,
            amount: data.amount,
            currency: data.currency,
            invoiceId: data._id,
          });
        }
      },
    },
  },
});
