import { OperationVariables, useMutation } from '@apollo/client';
import { APPROVE_AGENT } from '../graphql/mutations';
import { GET_AGENT } from '../graphql/queries';

export const useAgentApprove = () => {
  const [approve, { loading, error }] = useMutation(APPROVE_AGENT, {
    refetchQueries: [{ query: GET_AGENT }],
  });

  const approveAgent = async (code: string, options?: OperationVariables) => {
    await approve({ ...(options || {}), variables: { input: { code } } });
  };

  return {
    approveAgent,
    loading,
    error,
  };
};
