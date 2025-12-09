import { useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { ONEFIT_CUSTOMERS_CURSOR_SESSION_KEY } from '../constants/onefitCustomerCursorSessionKey';
import { ONE_FIT_CUSTOMERS } from '../graphql/onefitCustomerQueries';
import { OneFitCustomerFilters } from '../types/onefitCustomer';

const CUSTOMERS_PER_PAGE = 20;

export const useOneFitCustomers = (filters?: OneFitCustomerFilters) => {
  const { cursor } = useRecordTableCursor({
    sessionKey: ONEFIT_CUSTOMERS_CURSOR_SESSION_KEY,
  });

  const { data, loading, fetchMore } = useQuery(ONE_FIT_CUSTOMERS, {
    variables: {
      ...filters,
      cursor,
    },
  });

  const {
    list: customers,
    totalCount,
    pageInfo,
  } = data?.oneFitCustomers || {};

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
        limit: CUSTOMERS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          oneFitCustomers: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.oneFitCustomers,
            prevResult: prev.oneFitCustomers,
          }),
        });
      },
    });
  };

  return {
    customers,
    loading,
    totalCount,
    pageInfo,
    handleFetchMore,
  };
};

