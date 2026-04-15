import { IOpptyStatus } from '@/oppty/@types/status';
import { IContext } from '~/connectionResolvers';

export const statusMutations = {
  createBlockOpptyStatus: async (
    _root: undefined,
    { input }: { input: IOpptyStatus },
    { models }: IContext,
  ) => {
    return models.OpptyStatus.createOpptyStatus(input);
  },

  updateBlockOpptyStatus: async (
    _root: undefined,
    { _id, input }: { _id: string; input: IOpptyStatus },
    { models }: IContext,
  ) => {
    return models.OpptyStatus.updateOpptyStatus(_id, input);
  },

  updateBlockOpptyStatusOrder: async (
    _root: undefined,
    { _id, order }: { _id: string; order: number },
    { models }: IContext,
  ) => {
    return models.OpptyStatus.updateOpptyStatusOrder(_id, order);
  },

  removeBlockOpptyStatus: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.OpptyStatus.removeOpptyStatus(_id);
  },
};
