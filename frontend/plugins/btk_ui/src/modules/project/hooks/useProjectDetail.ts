import { useQuery } from '@apollo/client';
import {
  BTK_GET_PROJECT_DETAIL,
  BTK_GET_PROJECT_MEMBERS,
} from '../graphql/projectQueries';
import { IProjectDetail, IProjectMember } from '../types/projectTypes';
import { useParams } from 'react-router-dom';

export const useProjectDetail = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ btkGetProject: IProjectDetail }>(
    BTK_GET_PROJECT_DETAIL,
    { variables: { id } },
  );
  return { project: data?.btkGetProject, loading };
};

export const useProjectMembers = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{
    btkGetProjectMembers: IProjectMember[];
  }>(BTK_GET_PROJECT_MEMBERS, { variables: { project: id } });
  return { projectMembers: data?.btkGetProjectMembers, loading };
};
