import { IContext } from '~/connectionResolvers';
import { IOppty } from '@/oppty/@types/oppty';

export const opptyMutations = {
  createOppty: async (
    _parent: undefined,
    { input }: { input: IOppty },
    { models }: IContext,
  ) => {
    return models.Oppty.createOppty(input);
  },

  updateOppty: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IOppty },
    { models }: IContext,
  ) => {
    return models.Oppty.updateOppty(_id, input);
  },

  deleteOppty: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Oppty.deleteOppty(_id);
  },
};
