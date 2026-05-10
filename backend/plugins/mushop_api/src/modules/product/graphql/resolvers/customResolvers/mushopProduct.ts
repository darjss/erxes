import { IContext } from '~/connectionResolvers';
import { IMushopProductMushopDocument } from '@/product/@types/product';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const MushopProduct = {
  supplier: async (
    product: IMushopProductMushopDocument,
    _args: any,
    { models }: IContext,
  ) => {
    return models.Supplier.findOne({
      subdomain: product.subdomain,
    }).lean();
  },

  category: async (
    product: IMushopProductMushopDocument,
    _args: any,
    { subdomain }: IContext,
  ) => {
    if (!product.categoryId && !product.initialCategory) {
      return null;
    }

    if (product.initialCategory && !product.categoryId) {
      return product.initialCategory;
    }

    return sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      module: 'productCategories',
      action: 'findOne',
      input: { query: { _id: product.categoryId } },
      defaultValue: null,
    });
  },
};
