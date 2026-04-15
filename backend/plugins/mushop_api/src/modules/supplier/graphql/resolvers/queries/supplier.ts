import { IContext } from '~/connectionResolvers';
import { SupplierQueryParams } from '@/supplier/@types/supplier';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';

export const supplierQueries = {
  mushopSupplierDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Supplier.getSupplier(_id);
  },

  mushopSuppliers: async (
    _root: undefined,
    params: SupplierQueryParams & ICursorPaginateParams,
    { models }: IContext,
  ) => {
    return models.Supplier.listSuppliers(params);
  },
};
