import { IContext } from '~/connectionResolvers';
import { IBtkAttachment } from '@/attachment/@types/attachment';

export const attachmentMutations = {
  btkCreateAttachment: async (
    _parent: undefined,
    { input }: { input: IBtkAttachment },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.createBtkAttachment({ input });
  },

  btkUpdateAttachment: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IBtkAttachment },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.updateBtkAttachment({ _id, input });
  },

  btkDeleteAttachment: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.removeBtkAttachment({ _id });
  },
};

