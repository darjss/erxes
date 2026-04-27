import { IContext } from '~/connectionResolvers';
import { MUSHOP_PRODUCT_STATUS } from '@/product/db/definitions/product';
import { sendMessageToSupplier } from '~/utils/sendDecision';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const productMutations = {
  mushopAssignProductCategory: async (
    _root: undefined,
    { _id, categoryId }: { _id: string; categoryId?: string },
    { models, subdomain }: IContext,
  ) => {
    const product = await models.MushopProduct.assignCategory(_id, categoryId || null);

    if (product?.entityId) {
      await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        module: 'products',
        action: 'updateProduct',
        input: { _id: product.entityId, doc: { categoryId: categoryId || null } },
      });
    }

    return product;
  },

  mushopRemoveProduct: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    await models.MushopProduct.removeProduct(_id);
    return { success: true };
  },

  mushopUpdateProductStatus: async (
    _root: undefined,
    { _id, status, note }: { _id: string; status: string; note?: string },
    { models }: IContext,
  ) => {
    if (!MUSHOP_PRODUCT_STATUS.ALL.includes(status)) {
      throw new Error('Invalid product status');
    }

    const product = await models.MushopProduct.updateStatus(_id, status, note);

    if (product) {
      await sendMessageToSupplier({
        subdomain: product.subdomain,
        entityId: product.entityId,
        status,
        note,
      });
    }

    return product;
  },
};
