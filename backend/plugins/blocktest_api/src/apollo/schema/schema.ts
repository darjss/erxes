import {
  mutations as BlocktestMutations,
  queries as BlocktestQueries,
  types as BlocktestTypes,
} from '@/blocktest/graphql/schemas/blocktest';

export const types = `
  ${BlocktestTypes}
`;

export const queries = `
  ${BlocktestQueries}
`;

export const mutations = `
  ${BlocktestMutations}
`;

export default { types, queries, mutations };
