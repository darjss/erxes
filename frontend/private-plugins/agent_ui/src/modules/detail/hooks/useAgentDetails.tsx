import { useQuery } from '@apollo/client';
import { GET_AGENT_DETAILS } from '../graphql/queries';

export interface AgentFile {
  fileName: string;
  content: string;
}

export const useAgentDetails = (agentId?: string) => {
  const { data, loading, refetch } = useQuery(GET_AGENT_DETAILS, {
    variables: { agentId },
    skip: !agentId,
  });

  return {
    files: (data?.getAgentDetails ?? []) as AgentFile[],
    loading,
    refetch,
  };
};
