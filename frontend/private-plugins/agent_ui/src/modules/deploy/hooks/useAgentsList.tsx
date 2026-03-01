import { useQuery } from '@apollo/client';
import { GET_AGENTS_LIST } from '../graphql/queries';

export interface AgentItem {
  agentId: string;
  botName: string;
  emoji?: string;
  theme?: string;
  soulMd?: string;
  mentionPatterns?: string[];
}

export const useAgentsList = () => {
  const { data, loading, refetch } = useQuery(GET_AGENTS_LIST);

  return {
    agents: (data?.getAgentsList ?? []) as AgentItem[],
    loading,
    refetch,
  };
};
