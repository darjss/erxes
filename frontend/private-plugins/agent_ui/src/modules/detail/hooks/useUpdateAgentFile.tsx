import { useMutation } from '@apollo/client';
import { UPDATE_AGENT_FILE } from '../graphql/mutations';
import { GET_AGENT_DETAILS } from '../graphql/queries';

export const useUpdateAgentFile = (agentId?: string) => {
  const [update, { loading }] = useMutation(UPDATE_AGENT_FILE, {
    refetchQueries: [GET_AGENT_DETAILS],
  });

  const updateFile = async (filename: string, content: string) => {
    await update({ variables: { input: { filename, content, agentId } } });
  };

  return { updateFile, loading };
};
