import { identifierMutations } from '@/assistantOrg/graphql/resolvers/mutations/assistantOrg';
import { agentMutations } from '@/agent/graphql/resolvers/mutations/agent';
import { opencodeMutations } from '@/opencode/graphql/resolvers/mutations/opencode';

export const mutations = {
  ...identifierMutations,
  ...agentMutations,
  ...opencodeMutations,
};
