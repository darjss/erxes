import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { GET_AGENT } from '../graphql/queries';

export const useAgent = (identifierId?: string) => {
  const params = useParams();
  const routeIdentifierId = params.id;
  const currentIdentifierId = identifierId || routeIdentifierId;
  const { data, loading, refetch } = useQuery(GET_AGENT, {
    skip: !currentIdentifierId,
    variables: { identifierId: currentIdentifierId },
  });

  const agent = data?.getAgent;

  return {
    agent,
    loading,
    refetch,
  };
};
