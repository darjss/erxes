import { IContext } from '~/connectionResolvers';
import { IOffsetPaginateParams } from 'erxes-api-shared/core-types';
import { markResolvers, paginate } from 'erxes-api-shared/utils';
import { SupplierQueryParams } from '@/supplier/@types/supplier';
import { generateFilter } from '~/modules/supplier/utils';

export const cpSupplierQueries = {
  cpMushopSupplierDetail: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Supplier.getSupplier(_id);
  },

  cpMushopSuppliers: async (
    _root: undefined,
    params: SupplierQueryParams & IOffsetPaginateParams,
    { models }: IContext,
  ) => {
    const filter = generateFilter(params);

    return paginate(models.Supplier.find(filter), params);
  },
};

markResolvers(cpSupplierQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
