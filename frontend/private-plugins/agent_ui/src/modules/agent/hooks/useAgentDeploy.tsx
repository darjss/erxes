import { OperationVariables, useMutation } from '@apollo/client';
import { DEPLOY_AGENT } from '../graphql/mutations';

export const useAgentDeploy = () => {
  const [deploy, { loading, error }] = useMutation(DEPLOY_AGENT);

  const deployAgent = async (
    name: string,
    token: string,
    options?: OperationVariables,
  ) => {
    await deploy({ ...(options || {}), variables: { input: { name, token } } });
  };

  return {
    deployAgent,
    loading,
    error,
  };
};
