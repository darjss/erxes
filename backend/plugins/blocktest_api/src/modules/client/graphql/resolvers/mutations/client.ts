import { IContext } from '~/connectionResolvers';

export const cvClientMutations = {
  createCVClient: async (
    _parent: undefined,
    { name },
    { models }: IContext,
  ) => {
    return models.CVClient.createCVClient({ name });
  },

  updateCVClient: async (
    _parent: undefined,
    { _id, name },
    { models }: IContext,
  ) => {
    return models.CVClient.updateCVClient(_id, { name });
  },

  removeCVClient: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVClient.removeCVClient(_id);
  },
};
