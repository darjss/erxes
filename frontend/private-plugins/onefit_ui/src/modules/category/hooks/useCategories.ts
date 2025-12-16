import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { ONE_FIT_ACTIVITY_CATEGORIES } from '../graphql/categoryQueries';
import { CategoryFilters } from '../types/category';

export const useCategories = (filters?: CategoryFilters) => {
  const { data, loading, error, refetch } = useQuery(
    ONE_FIT_ACTIVITY_CATEGORIES,
    {
      variables: {
        ...filters,
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const categories = data?.oneFitActivityCategories || [];

  const handleRefetch = useCallback(() => {
    return refetch({
      ...filters,
    });
  }, [refetch, filters]);

  return {
    categories,
    loading,
    error,
    refetch: handleRefetch,
  };
};
