import { IContext } from '~/connectionResolvers';
import { MUSHOP_PRODUCT_STATUS } from '@/product/db/definitions/product';
import { syncProductToPosclient } from '~/utils/syncProductToPosclient';

const getSupplierMushopPosToken = async (
  models: IContext['models'],
  subdomain: string,
): Promise<string | undefined> => {
  const supplier = await models.Supplier.findOne({ subdomain }).lean();

  return supplier?.mushopPosToken;
};

export const productMutations = {
  mushopAssignProductCategory: async (
    _root: undefined,
    { _id, categoryId }: { _id: string; categoryId?: string },
    { models, subdomain, checkPermission }: IContext,
  ) => {
    await checkPermission('mushopAssignProductCategory');
    const product = await models.MushopProduct.assignCategory(
      _id,
      categoryId || null,
    );

    if (categoryId && product?.status === 'approved') {
      const posToken = await getSupplierMushopPosToken(
        models,
        product.subdomain,
      );

      await syncProductToPosclient({
        subdomain,
        posToken,
        product,
      });
    }

    return product;
  },

  mushopBulkUpdateProductStatus: async (
    _root: undefined,
    { ids, status }: { ids: string[]; status: string },
    { models, subdomain, checkPermission }: IContext,
  ) => {
    await checkPermission('mushopBulkUpdateProductStatus');
    if (!MUSHOP_PRODUCT_STATUS.ALL.includes(status)) {
      throw new Error('Invalid product status');
    }

    try {
      if (status === 'approved') {
        const products = await models.MushopProduct.find({
          _id: { $in: ids },
          categoryId: { $exists: true, $ne: null },
        }).lean();

        console.log('products', products.length);

        await Promise.all(
          products.map(async (p) => {
            const posToken = await getSupplierMushopPosToken(
              models,
              p.subdomain,
            );

            return syncProductToPosclient({
              subdomain,
              posToken,
              product: p,
            });
          }),
        );
      }

      await models.MushopProduct.updateMany(
        { _id: { $in: ids } },
        { $set: { status } },
      );

      return true;
    } catch (error) {
      throw new Error(
        `Failed to sync products to POS client: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  },

  mushopRemoveProduct: async (
    _root: undefined,
    { _id }: { _id: string },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('mushopRemoveProduct');
    await models.MushopProduct.removeProduct(_id);
    return { success: true };
  },

  mushopBulkRemoveProducts: async (
    _root: undefined,
    { ids }: { ids: string[] },
    { models, checkPermission }: IContext,
  ) => {
    await checkPermission('mushopBulkRemoveProducts');
    await models.MushopProduct.deleteMany({ _id: { $in: ids } });
    return { success: true, count: ids.length };
  },

  mushopUpdateProductStatus: async (
    _root: undefined,
    { _id, status, note }: { _id: string; status: string; note?: string },
    { models, subdomain, checkPermission }: IContext,
  ) => {
    await checkPermission('mushopUpdateProductStatus');
    if (!MUSHOP_PRODUCT_STATUS.ALL.includes(status)) {
      throw new Error('Invalid product status');
    }

    const existing = await models.MushopProduct.getProduct(_id);

    const updated = await models.MushopProduct.updateStatus(_id, status, note);

    if (status === 'approved' && existing.categoryId) {
      const posToken = await getSupplierMushopPosToken(
        models,
        existing.subdomain,
      );
      await syncProductToPosclient({
        subdomain,
        posToken,
        product: updated ?? existing,
        action: 'create',
      });
    }

    return updated;
  },
};
