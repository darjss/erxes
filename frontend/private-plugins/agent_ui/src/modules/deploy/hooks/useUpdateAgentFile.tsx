import { useMutation } from '@apollo/client';
import { UPDATE_AGENT_FILE } from '../graphql/mutations';

export const useUpdateAgentFile = (agentId?: string) => {
  const [update, { loading }] = useMutation(UPDATE_AGENT_FILE);

  const updateFile = async (filename: string, content: string) => {
    await update({ variables: { input: { filename, content, agentId } } });
  };

  return { updateFile, loading };
};
