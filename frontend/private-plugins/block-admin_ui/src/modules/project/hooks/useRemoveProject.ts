import { useMutation } from '@apollo/client';
import { BLOCK_REMOVE_PROJECT } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/graphql/projectMutations';

export const useRemoveProject = () => {
  const [removeProject, { loading }] = useMutation(BLOCK_REMOVE_PROJECT);
  return { removeProject, loading };
};
