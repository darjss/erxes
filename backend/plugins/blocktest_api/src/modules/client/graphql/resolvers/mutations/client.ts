import { IContext } from '~/connectionResolvers';
import { ICVClient } from '@/client/@types/client';

export const cvClientMutations = {
  createCVClient: async (
    _parent: undefined,
    params: ICVClient,
    { models }: IContext,
  ) => {
    return models.CVClient.createCVClient(params);
  },

  updateCVClient: async (
    _parent: undefined,
    { _id, params }: { _id: string; params: ICVClient },
    { models }: IContext,
  ) => {
    return models.CVClient.updateCVClient(_id, params);
  },

  removeCVClient: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVClient.removeCVClient(_id);
  },
};
