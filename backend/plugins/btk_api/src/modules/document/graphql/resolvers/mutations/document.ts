import { IContext } from '~/connectionResolvers';
import { IBtkDocumentDocument } from '@/document/@types/document';
import { requireLogin } from 'erxes-api-shared/core-modules';

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
    const document = await models.BtkDocument.findOne({ _id });

    if (document && document.itemType === 'contract') {
      const unit = await models.Contract.findOne({ _id: document.itemId });

      if (unit && unit.status === 'signed') {
        throw new Error('Can not update document because contract is signed');
      }
    }

    return models.BtkDocument.updateBtkDocument({ _id, input });
  },

  btkDeleteDocument: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const document = await models.BtkDocument.findOne({ _id });

    if (document && document.itemType === 'contract') {
      const unit = await models.Contract.findOne({ _id: document.itemId });

      if (unit && unit.status === 'signed') {
        throw new Error('Can not delete document because contract is signed');
      }
    }

    return models.BtkDocument.findByIdAndDelete({ _id });
  },
};

requireLogin(documentMutations, 'btkCreateDocument');
requireLogin(documentMutations, 'btkUpdateDocument');
requireLogin(documentMutations, 'btkDeleteDocument');
