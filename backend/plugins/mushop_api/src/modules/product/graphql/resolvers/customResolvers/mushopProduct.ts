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

  mushopCategory: async (
    product: IMushopProductMushopDocument,
    _args: any,
    { subdomain }: IContext,
  ) => {
    if (!product.mushopCategoryId) return null;

    return sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      module: 'productCategories',
      action: 'findOne',
      input: { query: { _id: product.mushopCategoryId } },
      defaultValue: null,
    });
  },
};
