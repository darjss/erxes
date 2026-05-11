import {
  mutations as IdentifierMutations,
  queries as IdentifierQueries,
  types as IdentifierTypes,
} from '@/assistantOrg/graphql/schemas/assistantOrg';
import {
  mutations as AgentMutations,
  queries as AgentQueries,
  types as AgentTypes,
} from '@/agent/graphql/schemas/agent';
import {
  mutations as OpencodeMutations,
  queries as OpencodeQueries,
  types as OpencodeTypes,
} from '@/opencode/graphql/schemas/opencode';

export const types = `
  ${IdentifierTypes}
  ${AgentTypes}
  ${OpencodeTypes}
`;

export const queries = `
  ${IdentifierQueries}
  ${AgentQueries}
  ${OpencodeQueries}
`;

export const mutations = `
  ${IdentifierMutations}
  ${AgentMutations}
  ${OpencodeMutations}
`;

export default { types, queries, mutations };
