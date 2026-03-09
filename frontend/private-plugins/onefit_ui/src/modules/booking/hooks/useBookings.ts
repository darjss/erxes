import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import {
  EnumCursorDirection,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import {
  BOOKINGS_CURSOR_SESSION_KEY,
  BOOKINGS_LOG_CURSOR_SESSION_KEY,
} from '../constants/bookingCursorSessionKey';
import { ONE_FIT_BOOKINGS } from '../graphql/bookingQueries';
import { BookingFilters } from '../types/booking';

const BOOKINGS_PER_PAGE = 20;

interface UseBookingsOptions {
  sessionKey?: string;
}

export const useBookings = (
  filters?: BookingFilters,
  options?: UseBookingsOptions,
) => {
  const sessionKey = options?.sessionKey || BOOKINGS_CURSOR_SESSION_KEY;

  const { cursor } = useRecordTableCursor({
    sessionKey,
  });

  const { data, loading, error, fetchMore, refetch } = useQuery(
    ONE_FIT_BOOKINGS,
    {
      variables: {
        ...filters,
        cursor,
      },
    },
  );

  const { list: bookings, totalCount, pageInfo } = data?.oneFitBookings || {};

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
        limit: BOOKINGS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          oneFitBookings: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.oneFitBookings,
            prevResult: prev.oneFitBookings,
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
    bookings,
    loading,
    error,
    totalCount,
    pageInfo,
    handleFetchMore,
    refetch: handleRefetch,
  };
};
