import { IContext } from '~/connectionResolvers';
import { sendSupplierStatusToSupplier } from '~/utils/sendSupplierStatus';

export const supplierMutations = {
  mushopUpdateSupplierVerificationStatus: async (
    _root: undefined,
    { _id, verificationStatus, note }: { _id: string; verificationStatus: string; note?: string },
    { models, user }: IContext,
  ) => {
    if (!user) throw new Error('Login required');

    const existing = await models.Supplier.getSupplier(_id);

    await sendSupplierStatusToSupplier({
      subdomain: existing.subdomain,
      entityId: existing.entityId,
      verificationStatus,
      note,
    });

    return models.Supplier.updateVerificationStatus(_id, verificationStatus, note);
  },

  mushopUpdateSupplierTier: async (
    _root: undefined,
    { _id, tierLevel }: { _id: string; tierLevel: number },
    { models, user }: IContext,
  ) => {
    if (!user) throw new Error('Login required');
    return models.Supplier.updateTierLevel(_id, tierLevel);
  },
};
