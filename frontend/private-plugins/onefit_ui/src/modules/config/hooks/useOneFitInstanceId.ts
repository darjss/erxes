import { useQuery } from '@apollo/client';
import { ONE_FIT_INSTANCE_ID } from '../graphql/onefitModeQueries';

export const useOneFitInstanceId = () => {
  const { data, loading, error } = useQuery(ONE_FIT_INSTANCE_ID, {
    fetchPolicy: 'cache-and-network',
  });

  const instanceId = data?.oneFitInstanceId as string | undefined;

  return {
    instanceId,
    loading,
    error,
  };
};

