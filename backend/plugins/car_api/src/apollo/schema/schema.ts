import {
  mutations as CarMutations,
  queries as CarQueries,
  types as CarTypes,
} from '@/car/graphql/schemas/car';

export const types = `
  ${CarTypes}
`;

export const queries = `
  ${CarQueries}
`;

export const mutations = `
  ${CarMutations}
`;

export default { types, queries, mutations };
