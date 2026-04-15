import { IContext } from '~/connectionResolvers';
import { ISupplier } from '@/supplier/@types/supplier';

export const supplierMutations = {
  mushopUpdateSupplier: async (
    _root: undefined,
    { _id, input }: { _id: string; input: ISupplier },
    { models }: IContext,
  ) => {
    return models.Supplier.adminUpdateSupplier(_id, input);
  },

  mushopUpdateSupplierVerificationStatus: async (
    _root: undefined,
    { _id, verificationStatus }: { _id: string; verificationStatus: string },
    { models }: IContext,
  ) => {
    return models.Supplier.updateVerificationStatus(_id, verificationStatus);
  },

  mushopUpdateSupplierTier: async (
    _root: undefined,
    { _id, tierLevel }: { _id: string; tierLevel: number },
    { models }: IContext,
  ) => {
    return models.Supplier.updateTierLevel(_id, tierLevel);
  },
};
