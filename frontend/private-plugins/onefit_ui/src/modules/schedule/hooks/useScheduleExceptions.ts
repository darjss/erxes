import { useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { SCHEDULE_EXCEPTIONS_CURSOR_SESSION_KEY } from '../constants/scheduleCursorSessionKey';
import { ONE_FIT_SCHEDULE_EXCEPTIONS } from '../graphql/scheduleQueries';
import { ScheduleExceptionFilters } from '../types/schedule';

const SCHEDULE_EXCEPTIONS_PER_PAGE = 20;

export const useScheduleExceptions = (filters: ScheduleExceptionFilters) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: SCHEDULE_EXCEPTIONS_CURSOR_SESSION_KEY,
  });

  const { data, loading, fetchMore } = useQuery(ONE_FIT_SCHEDULE_EXCEPTIONS, {
    variables: {
      ...filters,
      cursor,
    },
  });

  const {
    list: scheduleExceptions,
    totalCount,
    pageInfo,
  } = data?.oneFitScheduleExceptions || {};

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
        limit: SCHEDULE_EXCEPTIONS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          oneFitScheduleExceptions: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.oneFitScheduleExceptions,
            prevResult: prev.oneFitScheduleExceptions,
          }),
        });
      },
    });
  };

  return {
    scheduleExceptions,
    loading,
    totalCount,
    pageInfo,
    handleFetchMore,
  };
};





