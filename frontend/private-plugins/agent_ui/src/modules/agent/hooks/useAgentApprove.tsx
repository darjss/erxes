import { OperationVariables, useMutation } from '@apollo/client';
import { APPROVE_AGENT } from '../graphql/mutations';

export const useAgentApprove = () => {
  const [approve, { loading, error }] = useMutation(APPROVE_AGENT);

  const approveAgent = async (code: string, options?: OperationVariables) => {
    await approve({ ...(options || {}), variables: { input: { code } } });
  };

  return {
    approveAgent,
    loading,
    error,
  };
};
