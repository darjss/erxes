import { OperationVariables, useMutation } from '@apollo/client';
import { GET_AGENT } from '../../main/graphql/queries';
import { DEPLOY_AGENT } from '../graphql/mutations';

export const useAgentDeploy = () => {
  const [deploy, { loading }] = useMutation(DEPLOY_AGENT, {
    refetchQueries: [{ query: GET_AGENT }],
  });

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
  };
};
