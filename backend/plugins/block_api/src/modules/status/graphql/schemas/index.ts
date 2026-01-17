import {
  mutations as statusMutations,
  queries as statusQueries,
  types as statusTypes,
} from './status';

export const types = `
  ${statusTypes}
`;

export const queries = `
  ${statusQueries}
`;

export const mutations = `
  ${statusMutations}
`;
