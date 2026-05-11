import {
  mutations as SupplierMutations,
  queries as SupplierQueries,
  types as SupplierTypes,
} from '@/supplier/graphql/schemas/supplier';

export const types = `
  ${SupplierTypes}
`;

export const queries = `
  ${SupplierQueries}
`;

export const mutations = `
  ${SupplierMutations}
`;

export default { types, queries, mutations };
