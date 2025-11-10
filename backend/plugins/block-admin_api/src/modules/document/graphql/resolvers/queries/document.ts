import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const documentQueries = {
  blockGetDocument: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BlockDocument.findOne({ _id });
  },

  blockGetDocuments: async (
    _parent: undefined,
    { itemType, itemId }: { itemType: string; itemId: string },
    { models }: IContext,
  ) => {
    return models.BlockDocument.find({ itemType, itemId });
  },
};

requireLogin(documentQueries, 'blockGetDocument');
requireLogin(documentQueries, 'blockGetDocuments');
