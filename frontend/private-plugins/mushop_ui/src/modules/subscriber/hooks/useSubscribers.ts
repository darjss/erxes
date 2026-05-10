import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  useMultiQueryState,
  validateFetchMore,
} from 'erxes-ui';
import { MUSHOP_SUBSCRIPTIONS } from '../graphql/queries';
import { ISubscriberList } from '../types';

export const useSubscriberVariables = (
  variables?: QueryHookOptions['variables'],
) => {
  const [{ searchValue, status }] = useMultiQueryState<{
    searchValue: string;
    status: string;
  }>(['searchValue', 'status']);

  return {
    ...(variables || {}),
    searchValue: searchValue || undefined,
    status: status || undefined,
  };
};

export const useSubscribers = (options?: QueryHookOptions) => {
  const variables = useSubscriberVariables(options?.variables);

  const { data, loading, fetchMore } = useQuery<{
    mushopSubscriptions: ISubscriberList;
  }>(MUSHOP_SUBSCRIPTIONS, { ...options, variables });

  const {
    list: subscribers,
    pageInfo,
    totalCount,
  } = data?.mushopSubscriptions || {};

  const handleFetchMore = ({
    direction = EnumCursorDirection.FORWARD,
  }: { direction?: EnumCursorDirection } = {}) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        ...variables,
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: 20,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          mushopSubscriptions: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.mushopSubscriptions,
            prevResult: prev.mushopSubscriptions,
          }),
        });
      },
    });
  };

  return { subscribers, loading, pageInfo, totalCount, handleFetchMore };
};
