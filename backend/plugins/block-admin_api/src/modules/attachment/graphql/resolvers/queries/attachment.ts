import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const attachmentQueries = {
  blockGetAttachment: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BlockAttachment.findOne({ _id });
  },

  blockGetAttachments: async (
    _parent: undefined,
    { itemType, itemId }: { itemType: string; itemId: string },
    { models }: IContext,
  ) => {
    return models.BlockAttachment.find({ itemType, itemId });
  },
};

requireLogin(attachmentQueries, 'blockGetAttachment');
requireLogin(attachmentQueries, 'blockGetAttachments');
