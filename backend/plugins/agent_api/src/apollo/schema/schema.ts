import {
  mutations as AgentMutations,
  queries as AgentQueries,
  types as AgentTypes,
} from '@/agent/graphql/schemas/agent';

export const types = `
  ${AgentTypes}
`;

export const queries = `
  ${AgentQueries}
`;

export const mutations = `
  ${AgentMutations}
`;

export default { types, queries, mutations };
