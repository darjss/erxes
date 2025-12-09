import { IContext } from '~/connectionResolvers';
import { ICVClient } from '@/client/@types/client';

export const cvClientMutations = {
  createCVClient: async (
    _parent: undefined,
    { input }: { input: ICVClient },
    { models }: IContext,
  ) => {
    return models.CVClient.createCVClient(input);
  },

  updateCVClient: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: ICVClient },
    { models }: IContext,
  ) => {
    return models.CVClient.updateCVClient(_id, input);
  },

  removeCVClient: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVClient.removeCVClient(_id);
  },
};
