import { useQuery } from '@apollo/client';
import {
  BTK_GET_PROJECT_LIST,
  BTK_GET_PROJECTS,
} from '../graphql/projectQueries';
import { IProject } from '../types/projectTypes';

export const useProjects = (list = false) => {
  const { data, loading } = useQuery<{ btkGetProjects: IProject[] }>(
    list ? BTK_GET_PROJECT_LIST : BTK_GET_PROJECTS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  return { projects: data?.btkGetProjects, loading };
};
