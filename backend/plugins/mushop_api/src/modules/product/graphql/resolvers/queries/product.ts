import { IContext } from '~/connectionResolvers';
import { ProductQueryParams } from '@/product/@types/product';
import { sendTRPCMessage } from 'erxes-api-shared/utils';

export const productQueries = {
  mushopProducts: async (
    _root: undefined,
    params: ProductQueryParams,
    { models }: IContext,
  ) => {
    const { list } = await models.MushopProduct.listProducts(params);
    return list;
  },

  mushopProductsTotalCount: async (
    _root: undefined,
    params: ProductQueryParams,
    { models }: IContext,
  ) => {
    const { totalCount } = await models.MushopProduct.listProducts(params);
    return totalCount;
  },

  mushopProductDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.MushopProduct.getProduct(_id);
  },

  mushopCoreProductCategories: async (
    _root: undefined,
    { parentId, searchValue }: { parentId?: string; searchValue?: string },
    { subdomain }: IContext,
  ) => {
    const query: any = {};
    if (parentId) query.parentId = parentId;
    if (searchValue) query.name = { $regex: searchValue, $options: 'i' };

    return sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      module: 'productCategories',
      action: 'find',
      input: { query, sort: { order: 1 } },
      defaultValue: [],
    });
  },
};
