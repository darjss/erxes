import {
  mutations as SupplierMutations,
  queries as SupplierQueries,
  types as SupplierTypes,
} from '@/supplier/graphql/schemas/supplier';

import {
  mutations as InventoryMutations,
  queries as InventoryQueries,
  types as InventoryTypes,
} from '@/inventories/graphql/schemas/inventory';

export const types = `
  ${SupplierTypes}
  ${InventoryTypes}
`;

export const queries = `
  ${SupplierQueries}
  ${InventoryQueries}
`;

export const mutations = `
  ${SupplierMutations}
  ${InventoryMutations}
`;

export default { types, queries, mutations };
