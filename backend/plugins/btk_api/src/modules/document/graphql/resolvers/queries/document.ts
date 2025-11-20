import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const documentQueries = {
  btkGetDocument: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BtkDocument.findOne({ _id });
  },

  btkGetDocuments: async (
    _parent: undefined,
    { itemType, itemId }: { itemType: string; itemId: string },
    { models }: IContext,
  ) => {
    return models.BtkDocument.find({ itemType, itemId });
  },
};

requireLogin(documentQueries, 'btkGetDocument');
requireLogin(documentQueries, 'btkGetDocuments');
