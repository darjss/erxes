import { useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { BOOKINGS_CURSOR_SESSION_KEY } from '../constants/bookingCursorSessionKey';
import { ONE_FIT_BOOKINGS } from '../graphql/bookingQueries';
import { BookingFilters } from '../types/booking';

const BOOKINGS_PER_PAGE = 20;

export const useBookings = (filters?: BookingFilters) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: BOOKINGS_CURSOR_SESSION_KEY,
  });

  const { data, loading, fetchMore } = useQuery(ONE_FIT_BOOKINGS, {
    variables: {
      ...filters,
      cursor,
    },
  });

  const {
    list: bookings,
    totalCount,
    pageInfo,
  } = data?.oneFitBookings || {};

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

  return {
    bookings,
    loading,
    totalCount,
    pageInfo,
    handleFetchMore,
  };
};

