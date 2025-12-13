import { IContext } from '~/connectionResolvers';
import { ICVClient } from '@/client/@types/client';

export const cvClientMutations = {
  cvCreateClient: async (
    _parent: undefined,
    { input }: { input: ICVClient },
    { models }: IContext,
  ) => {
    return models.CVClient.cvCreateClient(input);
  },

  cvUpdateClient: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: ICVClient },
    { models }: IContext,
  ) => {
    return models.CVClient.cvUpdateClient(_id, input);
  },

  cvRemoveClient: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.CVClient.cvRemoveClient(_id);
  },
};
