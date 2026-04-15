import { IContext } from '~/connectionResolvers';
import { MUSHOP_PRODUCT_STATUS } from '@/product/db/definitions/product';

export const productMutations = {
  mushopAssignProductCategory: async (
    _root: undefined,
    { _id, mushopCategoryId }: { _id: string; mushopCategoryId?: string },
    { models }: IContext,
  ) => {
    return models.MushopProduct.assignCategory(_id, mushopCategoryId || null);
  },

  mushopUpdateProductStatus: async (
    _root: undefined,
    { _id, status }: { _id: string; status: string },
    { models }: IContext,
  ) => {
    if (!MUSHOP_PRODUCT_STATUS.ALL.includes(status)) {
      throw new Error('Invalid product status');
    }

    return models.MushopProduct.findOneAndUpdate(
      { _id },
      { $set: { status } },
      { new: true },
    );
  },
};
