import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const documentQueries = {
  btkAdminGetDocument: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BtkDocument.findOne({ _id });
  },

  btkAdminGetDocuments: async (
    _parent: undefined,
    { itemType, itemId }: { itemType: string; itemId: string },
    { models }: IContext,
  ) => {
    return models.BtkDocument.find({ itemType, itemId });
  },
};

requireLogin(documentQueries, 'btkAdminGetDocument');
requireLogin(documentQueries, 'btkAdminGetDocuments');
