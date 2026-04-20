import { IContext } from '~/connectionResolvers';
import { IMushopProductMushopDocument } from '@/product/@types/product';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

const isSubscribed = async (
  models: IContext['models'],
  cpUser: any,
): Promise<boolean> => {
  if (!cpUser) return false;
  const sub = await models.CustomerSubscription.getActiveSubscription(
    cpUser._id,
  );
  return !!sub;
};

export const MushopProduct = {
  unitPrice: async (
    product: IMushopProductMushopDocument,
    _args: any,
    { models, cpUser, clientPortal }: IContext,
  ) => {
    if (clientPortal || cpUser) {
      if (!(await isSubscribed(models, cpUser))) return null;
    }

    return product.unitPrice ?? null;
  },

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
