import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import {
  EnumCursorDirection,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { CATEGORIES_CURSOR_SESSION_KEY } from '../constants/categoryCursorSessionKey';
import { ONE_FIT_ACTIVITY_CATEGORIES } from '../graphql/categoryQueries';
import { CategoryFilters } from '../types/category';

const CATEGORIES_PER_PAGE = 20;

export const useCategories = (filters?: CategoryFilters) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: CATEGORIES_CURSOR_SESSION_KEY,
  });

  const { data, loading, error, fetchMore, refetch } = useQuery(
    ONE_FIT_ACTIVITY_CATEGORIES,
    {
      variables: {
        ...filters,
        cursor,
      },
    },
  );

  const {
    list: categories,
    totalCount,
    pageInfo,
  } = data?.oneFitActivityCategories || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (
      !validateFetchMore({
        direction,
        pageInfo,
      })
    ) {
      return;
    }

    fetchMore({
      variables: {
        ...filters,
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: CATEGORIES_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          oneFitActivityCategories: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.oneFitActivityCategories,
            prevResult: prev.oneFitActivityCategories,
          }),
        });
      },
    });
  };

  const handleRefetch = useCallback(() => {
    return refetch({
      ...filters,
      cursor,
    });
  }, [refetch, filters, cursor]);

  return {
    categories,
    loading,
    error,
    totalCount,
    pageInfo,
    handleFetchMore,
    refetch: handleRefetch,
  };
};
