import { MutationHookOptions, useMutation } from '@apollo/client';
import { ADD_AGENT } from '../graphql/mutations';
import { GET_AGENTS_LIST } from '../graphql/queries';

export const useAgentAdd = () => {
  const [addAgent, { loading }] = useMutation(ADD_AGENT, {
    refetchQueries: [GET_AGENTS_LIST],
  });

  const mutate = async (options: MutationHookOptions<any, any>) => {
    await addAgent(options);
  };

  return { addAgent: mutate, loading };
};
