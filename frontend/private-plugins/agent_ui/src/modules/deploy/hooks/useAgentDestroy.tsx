import { OperationVariables, useMutation } from '@apollo/client';
import { GET_AGENT } from '../../main/graphql/queries';
import { DESTROY_AGENT } from '../graphql/mutations';

export const useAgentDestroy = () => {
  const [destroy, { loading, error }] = useMutation(DESTROY_AGENT, {
    refetchQueries: [{ query: GET_AGENT }],
  });

  const destroyAgent = async (options?: OperationVariables) => {
    await destroy({ ...(options || {}) });
  };

  return {
    destroyAgent,
    loading,
    error,
  };
};
