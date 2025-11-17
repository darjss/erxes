import { useQuery } from '@apollo/client';
import { BTK_GET_DEVELOPER_INFO } from '../graphql/btkQueries';

export const useDeveloperInfo = () => {
  const { data, loading, error } = useQuery(BTK_GET_DEVELOPER_INFO);
  const { getDeveloperInfo: developerInfo } = data || {};
  return { loading, error, developerInfo };
};
