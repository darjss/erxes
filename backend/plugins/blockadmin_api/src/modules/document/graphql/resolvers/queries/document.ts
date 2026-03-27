import { IContext } from '~/connectionResolvers';

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
