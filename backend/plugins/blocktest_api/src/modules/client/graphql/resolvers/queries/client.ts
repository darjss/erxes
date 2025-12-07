import { IContext } from '~/connectionResolvers';

export const cvClientQueries = {
  getCVClient: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CVClient.getCVClient(_id);
  },

  getCVClients: async (
    _parent: undefined,
    _args: unknown,
    { models }: IContext,
  ) => {
    return models.CVClient.getCVClients();
  },
};
