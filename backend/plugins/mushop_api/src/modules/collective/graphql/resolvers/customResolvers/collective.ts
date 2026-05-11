import { IContext } from '~/connectionResolvers';
import { ICollectiveDocument } from '@/collective/@types/collective';

export const MushopCollective = {
  suppliers: async (
    { supplierIds = [] }: ICollectiveDocument,
    _args: unknown,
    { models }: IContext,
  ) => {
    if (!supplierIds.length) return [];
    return models.Supplier.find({ _id: { $in: supplierIds } }).lean();
  },
};

export const MushopCollectiveSyncResult = {
  supplier: async (
    { supplierId }: { supplierId: string },
    _args: unknown,
    { models }: IContext,
  ) => {
    if (!supplierId) return null;
    return models.Supplier.findOne({ _id: supplierId }).lean();
  },
};
