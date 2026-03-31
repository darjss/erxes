import { IContext } from '~/connectionResolvers';

export const attachmentQueries = {
  btkGetAttachment: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.findOne({ _id });
  },

  btkGetAttachments: async (
    _parent: undefined,
    { itemType, itemId }: { itemType: string; itemId: string },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.find({ itemType, itemId });
  },
};

