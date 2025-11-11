import { useQuery } from '@apollo/client';
import {
  BLOCK_GET_PROJECT_LIST,
  BLOCK_GET_PROJECTS,
} from '../graphql/projectQueries';
import { IProject } from '../types/projectTypes';

export const useProjects = (list = false) => {
  const { data, loading } = useQuery<{ blockAdminGetProjects: IProject[] }>(
    list ? BLOCK_GET_PROJECT_LIST : BLOCK_GET_PROJECTS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  return { projects: data?.blockAdminGetProjects, loading };
};
