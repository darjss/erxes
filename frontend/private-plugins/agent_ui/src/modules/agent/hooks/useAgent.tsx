import { useQuery } from '@apollo/client';
import { GET_AGENT } from '../graphql/queries';

export const useAgent = () => {
  const { data, loading, refetch } = useQuery(GET_AGENT);

  const agent = data?.getAgent;

  return {
    agent,
    loading,
    refetch,
  };
};
