import { IContext } from '~/connectionResolvers';
import { IBlockAttachment } from '@/attachment/@types/attachment';

export const attachmentMutations = {
  blockCreateAttachment: async (
    _parent: undefined,
    { input }: { input: IBlockAttachment },
    { models }: IContext,
  ) => {
    return models.BlockAttachment.createBlockAttachment({ input });
  },

  blockUpdateAttachment: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IBlockAttachment },
    { models }: IContext,
  ) => {
    return models.BlockAttachment.updateBlockAttachment({ _id, input });
  },

  blockDeleteAttachment: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BlockAttachment.removeBlockAttachment({ _id });
  },
};

