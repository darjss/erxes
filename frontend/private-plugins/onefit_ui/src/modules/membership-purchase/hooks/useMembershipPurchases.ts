import { useQuery } from '@apollo/client';
import { useCallback } from 'react';
import {
  EnumCursorDirection,
  mergeCursorData,
  useRecordTableCursor,
  validateFetchMore,
} from 'erxes-ui';
import { MEMBERSHIP_PURCHASES_CURSOR_SESSION_KEY } from '../constants/membershipPurchaseCursorSessionKey';
import { ONE_FIT_MEMBERSHIP_PURCHASES } from '../graphql/membershipPurchaseQueries';
import { MembershipPurchaseFilters } from '../types/membershipPurchase';

const MEMBERSHIP_PURCHASES_PER_PAGE = 20;

export function useMembershipPurchases(filters?: MembershipPurchaseFilters) {
  const { cursor } = useRecordTableCursor({
    sessionKey: MEMBERSHIP_PURCHASES_CURSOR_SESSION_KEY,
  });

  const { data, loading, error, fetchMore, refetch } = useQuery(
    ONE_FIT_MEMBERSHIP_PURCHASES,
    {
      variables: {
        ...filters,
        cursor,
        limit: MEMBERSHIP_PURCHASES_PER_PAGE,
      },
    },
  );

  const {
    list: membershipPurchases,
    totalCount,
    pageInfo,
  } = data?.oneFitMembershipPurchases || {};

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        ...filters,
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: MEMBERSHIP_PURCHASES_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          oneFitMembershipPurchases: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.oneFitMembershipPurchases,
            prevResult: prev.oneFitMembershipPurchases,
          }),
        });
      },
    });
  };

  const handleRefetch = useCallback(() => {
    return refetch({
      ...filters,
      cursor,
      limit: MEMBERSHIP_PURCHASES_PER_PAGE,
    });
  }, [refetch, filters, cursor]);

  return {
    membershipPurchases,
    loading,
    error,
    totalCount,
    pageInfo,
    handleFetchMore,
    refetch: handleRefetch,
  };
}

