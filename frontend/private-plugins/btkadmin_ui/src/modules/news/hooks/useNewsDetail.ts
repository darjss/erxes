import { useQuery } from '@apollo/client';
import {
  BTK_GET_NEWS_DETAIL,
  BTK_GET_NEWS_MEMBERS,
} from '../graphql/newsQueries';
import { INewsDetail, INewsMember } from '../types/newsTypes';
import { useParams } from 'react-router-dom';

export const useNewsDetail = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{ btkAdminGetNews: INewsDetail }>(
    BTK_GET_NEWS_DETAIL,
    { variables: { id } },
  );
  return { news: data?.btkAdminGetNews, loading };
};

export const useNewsMembers = () => {
  const { id } = useParams();
  const { data, loading } = useQuery<{
    btkGetNewsMembers: INewsMember[];
  }>(BTK_GET_NEWS_MEMBERS, { variables: { news: id } });
  return { projectMembers: data?.btkGetNewsMembers, loading };
};
