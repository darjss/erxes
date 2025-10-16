import { IContext } from '~/connectionResolvers';
import { IBlockDocumentDocument } from '@/document/@types/document';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const documentMutations = {
  blockCreateDocument: async (
    _parent: undefined,
    { input }: { input: IBlockDocumentDocument },
    { models }: IContext,
  ) => {
    return models.BlockDocument.createBlockDocument({ input });
  },

  blockUpdateDocument: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IBlockDocumentDocument },
    { models }: IContext,
  ) => {
    const document = await models.BlockDocument.findOne({ _id });

    if (document && document.itemType === 'contract') {
      const unit = await models.Contract.findOne({ _id: document.itemId });

      if (unit && unit.status === 'signed') {
        throw new Error('Can not update document because contract is signed');
      }
    }

    return models.BlockDocument.updateBlockDocument({ _id, input });
  },

  blockDeleteDocument: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const document = await models.BlockDocument.findOne({ _id });

    if (document && document.itemType === 'contract') {
      const unit = await models.Contract.findOne({ _id: document.itemId });

      if (unit && unit.status === 'signed') {
        throw new Error('Can not delete document because contract is signed');
      }
    }

    return models.BlockDocument.findByIdAndDelete({ _id });
  },
};

requireLogin(documentMutations, 'blockCreateDocument');
requireLogin(documentMutations, 'blockUpdateDocument');
requireLogin(documentMutations, 'blockDeleteDocument');
