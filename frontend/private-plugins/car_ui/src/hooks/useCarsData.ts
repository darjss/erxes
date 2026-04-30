import { QueryHookOptions, useQuery } from '@apollo/client';

import {
  GET_CAR_CATEGORIES,
  GET_CAR_CATEGORY_DETAIL,
  GET_CAR_COUNT_BY_TAGS,
  GET_CAR_COUNTS,
  GET_CAR_DETAIL,
  GET_CARS,
  GET_CARS_MAIN,
  GET_DEALS_BY_IDS,
} from '~/graphql/documents';
import {
  ICar,
  ICarCategory,
  ICarCounts,
  ICarsMainResponse,
  IDeal,
} from '~/types/car';

export const useCarsMain = (
  variables: Record<string, unknown>,
  options?: QueryHookOptions<{
    carsMain: ICarsMainResponse;
  }>,
) => {
  const { data, loading, error, refetch } = useQuery<{
    carsMain: ICarsMainResponse;
  }>(GET_CARS_MAIN, {
    variables,
    ...options,
  });

  return {
    cars: data?.carsMain?.list || [],
    totalCount: data?.carsMain?.totalCount || 0,
    loading,
    error,
    refetch,
  };
};

export const useCars = (
  variables: Record<string, unknown>,
  options?: QueryHookOptions<{ cars: ICar[] }>,
) => {
  const { data, loading, error, refetch } = useQuery<{ cars: ICar[] }>(
    GET_CARS,
    {
      variables,
      ...options,
    },
  );

  return {
    cars: data?.cars || [],
    loading,
    error,
    refetch,
  };
};

export const useCarDetail = (
  _id?: string,
  options?: QueryHookOptions<{ carDetail: ICar }>,
) => {
  const { data, loading, error, refetch } = useQuery<{ carDetail: ICar }>(
    GET_CAR_DETAIL,
    {
      variables: { _id },
      skip: !_id,
      ...options,
    },
  );

  return {
    car: data?.carDetail,
    loading,
    error,
    refetch,
  };
};

export const useCarCategories = (
  options?: QueryHookOptions<{ carCategories: ICarCategory[] }>,
) => {
  const { data, loading, error, refetch } = useQuery<{
    carCategories: ICarCategory[];
  }>(GET_CAR_CATEGORIES, {
    ...options,
  });

  return {
    carCategories: data?.carCategories || [],
    loading,
    error,
    refetch,
  };
};

export const useCarCategoryDetail = (
  _id?: string,
  options?: QueryHookOptions<{ carCategoryDetail: ICarCategory }>,
) => {
  const { data, loading, error, refetch } = useQuery<{
    carCategoryDetail: ICarCategory;
  }>(GET_CAR_CATEGORY_DETAIL, {
    variables: { _id },
    skip: !_id,
    ...options,
  });

  return {
    carCategory: data?.carCategoryDetail,
    loading,
    error,
    refetch,
  };
};

export const useCarCounts = (
  variables?: Record<string, unknown>,
  options?: QueryHookOptions<{ carCounts: ICarCounts }>,
) => {
  const { data, loading, error } = useQuery<{ carCounts: ICarCounts }>(
    GET_CAR_COUNTS,
    {
      variables,
      ...options,
    },
  );

  return {
    counts: data?.carCounts || {},
    loading,
    error,
  };
};

export const useCarCountByTags = (
  options?: QueryHookOptions<{ carCountByTags: Record<string, number> }>,
) => {
  const { data, loading, error } = useQuery<{
    carCountByTags: Record<string, number>;
  }>(GET_CAR_COUNT_BY_TAGS, options);

  return {
    counts: data?.carCountByTags || {},
    loading,
    error,
  };
};

export const useDealsByIds = (
  ids: string[],
  options?: QueryHookOptions<{ deals: { list: IDeal[] } }>,
) => {
  const { data, loading, error } = useQuery<{ deals: { list: IDeal[] } }>(
    GET_DEALS_BY_IDS,
    {
      variables: { _ids: ids },
      skip: ids.length === 0,
      ...options,
    },
  );

  return {
    deals: data?.deals?.list || [],
    loading,
    error,
  };
};
