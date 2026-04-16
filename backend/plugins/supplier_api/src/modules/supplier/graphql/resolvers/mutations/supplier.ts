import { IContext } from '~/connectionResolvers';
import { ISupplier } from '@/supplier/@types/supplier';

export const supplierMutations = {
  updateSupplier: async (
    _root: undefined,
    { input }: { input: ISupplier },
    { models, user }: IContext,
  ) => {
    return models.Supplier.updateSupplier(user._id, input);
  },

  supplierUpdateVerificationStatus: async (
    _root: undefined,
    { _id, status }: { _id: string; status: string },
    { models }: IContext,
  ) => {
    return models.Supplier.updateVerificationStatus(_id, status);
  },

  supplierUpdateTierLevel: async (
    _root: undefined,
    { _id, tierLevel }: { _id: string; tierLevel: number },
    { models }: IContext,
  ) => {
    return models.Supplier.updateTierLevel(_id, tierLevel);
  },
};
