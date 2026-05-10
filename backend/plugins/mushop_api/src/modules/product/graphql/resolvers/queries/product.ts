import { IContext } from '~/connectionResolvers';
import { ProductQueryParams } from '@/product/@types/product';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, sendTRPCMessage } from 'erxes-api-shared/utils';

export const productQueries = {
  mushopProducts: async (
    _root: undefined,
    params: ProductQueryParams & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    const { supplierId, categoryId, status, searchValue } = params;

    const filter: any = {};

    if (supplierId) {
      const supplier = await models.Supplier.getSupplier(supplierId);

      filter.subdomain = supplier.subdomain;
    }

    if (categoryId) filter.categoryId = categoryId;

    if (status) filter.status = status;

    if (searchValue) {
      filter.$or = [
        { name: { $regex: searchValue, $options: 'i' } },
        { code: { $regex: searchValue, $options: 'i' } },
      ];
    }

    return cursorPaginate({
      model: models.MushopProduct,
      params,
      query: filter,
    });
  },

  mushopProductDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.MushopProduct.getProduct(_id);
  },
};
