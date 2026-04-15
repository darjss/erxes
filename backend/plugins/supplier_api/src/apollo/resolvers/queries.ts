import { supplierQueries } from '@/supplier/graphql/resolvers/queries/supplier';
import { inventoryQueries } from '@/inventories/graphql/resolvers/queries/inventory';

export const queries = {
  ...supplierQueries,
  ...inventoryQueries,
};
