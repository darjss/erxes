import { IContext } from '~/connectionResolvers';

export const attachmentQueries = {
  btkAdminGetAttachment: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.findOne({ _id });
  },

  btkAdminGetAttachments: async (
    _parent: undefined,
    { itemType, itemId }: { itemType: string; itemId: string },
    { models }: IContext,
  ) => {
    return models.BtkAttachment.find({ itemType, itemId });
  },
};
