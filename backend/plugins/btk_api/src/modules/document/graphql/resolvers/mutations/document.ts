import { IContext } from '~/connectionResolvers';
import { IBtkDocumentDocument } from '@/document/@types/document';

export const documentMutations = {
  btkCreateDocument: async (
    _parent: undefined,
    { input }: { input: IBtkDocumentDocument },
    { models }: IContext,
  ) => {
    return models.BtkDocument.createBtkDocument({ input });
  },

  btkUpdateDocument: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IBtkDocumentDocument },
    { models }: IContext,
  ) => {
    return models.BtkDocument.updateBtkDocument({ _id, input });
  },

  btkDeleteDocument: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.BtkDocument.findByIdAndDelete({ _id });
  },
};

