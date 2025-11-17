import { useMutation } from '@apollo/client';
import { BTK_PUBLISH_PROJECT } from '../graphql/projectMutations';

export const usePublishProject = () => {
  const [publishProject, { loading }] = useMutation(BTK_PUBLISH_PROJECT, {
    refetchQueries: ['BtkGetProjects'],
  });

  return {
    publishProject: publishProject,
    loading,
  };
};
