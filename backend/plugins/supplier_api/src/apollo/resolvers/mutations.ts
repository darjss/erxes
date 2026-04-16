import { supplierMutations } from '@/supplier/graphql/resolvers/mutations/supplier';
import { inventoryMutations } from '@/inventories/graphql/resolvers/mutations/inventory';

export const mutations = {
  ...supplierMutations,
  ...inventoryMutations,
};
