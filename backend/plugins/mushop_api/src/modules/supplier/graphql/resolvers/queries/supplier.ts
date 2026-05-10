import { isDev } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { SupplierQueryParams } from '@/supplier/@types/supplier';
import { ICursorPaginateParams } from 'erxes-api-shared/core-types';

const { SUPPLIER_API_URL } = process.env;

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

  mushopSupplierPosList: async (
    _root: undefined,
    { supplierId }: { supplierId: string },
    { models, user }: IContext,
  ) => {
    if (!user) throw new Error('Login required');

    if (!SUPPLIER_API_URL) return [];

    try {
      const supplier = await models.Supplier.getSupplier(supplierId);

      const url = isDev
        ? 'http://localhost:4000'
        : SUPPLIER_API_URL.replace('<subdomain>', supplier.subdomain);

      const res = await fetch(`${url}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{ posclientConfigs { _id name token } }`,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) return [];

      const json: any = await res.json();

      return json?.data?.posclientConfigs ?? [];
    } catch (error) {
      throw new Error(`Failed to fetch POS configurations: ${error.message}`);
    }
  },
};
