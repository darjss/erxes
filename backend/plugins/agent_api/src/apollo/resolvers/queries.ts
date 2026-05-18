import { identifierQueries } from '@/assistantOrg/graphql/resolvers/queries/assistantOrg';
import { agentQueries } from '@/agent/graphql/resolvers/queries/agent';
import { opencodeQueries } from '@/opencode/graphql/resolvers/queries/opencode';

export const queries = {
  ...identifierQueries,
  ...agentQueries,
  ...opencodeQueries,
};
