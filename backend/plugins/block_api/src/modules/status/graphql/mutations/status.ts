import { IStatus } from '@/status/@types/status';
import { IContext } from '~/connectionResolvers';

export const statusMutations = {
  createBlockStatus: async (
    _root: undefined,
    { input }: { input: IStatus },
    { models }: IContext,
  ) => {
    return models.Status.createStatus(input);
  },

  updateBlockStatus: async (
    _root: undefined,
    { _id, input }: { _id: string; input: IStatus },
    { models }: IContext,
  ) => {
    return models.Status.updateStatus(_id, input);
  },

  updateBlockStatusOrder: async (
    _root: undefined,
    { _id, order }: { _id: string; order: number },
    { models }: IContext,
  ) => {
    return models.Status.updateStatusOrder(_id, order);
  },

  removeBlockStatus: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Status.removeStatus(_id);
  },
};
