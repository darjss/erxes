import { IContext } from '~/connectionResolvers';

export const cvClientQueries = {
  getCVClient: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVClient.getCVClient(_id);
  },

  getCVClients: async (_parent: undefined, { models }: IContext) => {
    return models.CVClient.getCVClients();
  },
};
