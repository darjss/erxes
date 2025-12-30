import { useQuery } from '@apollo/client';
import { ONE_FIT_MODE } from '../graphql/onefitModeQueries';

export const useOneFitMode = () => {
  const { data, loading, error } = useQuery(ONE_FIT_MODE, {
    fetchPolicy: 'cache-and-network',
  });

  const mode = data?.oneFitMode as 'master' | 'slave' | undefined;
  const isSlaveMode = mode === 'slave';

  return {
    mode,
    isSlaveMode,
    loading,
    error,
  };
};

