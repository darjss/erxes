import { useQuery } from '@apollo/client';
import { GET_AGENTS_LIST } from '../graphql/queries';

export interface AgentListItem {
  id: string;
  identity: Record<string, unknown> | null;
}

export const useAgentsList = () => {
  const { data, loading, refetch } = useQuery(GET_AGENTS_LIST);

  return {
    agents: (data?.getAgentsList ?? []) as AgentListItem[],
    loading,
    refetch,
  };
};
