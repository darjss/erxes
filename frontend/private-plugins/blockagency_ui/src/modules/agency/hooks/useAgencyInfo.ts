import { QueryHookOptions, useQuery } from '@apollo/client';
import { GET_AGENCY_INFO } from '../graphql';

export const useAgencyInfo = (options?: QueryHookOptions) => {
  const { data, error, loading } = useQuery(GET_AGENCY_INFO, options);
  return {
    agencyInfo: data?.getAgencyInfo,
    error,
    loading,
  };
};
