import { GET_OPPTYS } from '@/oppty/graphql/queries/getOpptys';
import { OPPTY_LIST_CHANGED } from '@/oppty/graphql/subscriptions/opptyListChanged';
import { IOppty } from '@/oppty/types/opptyTypes';
import { QueryHookOptions, useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  ICursorListResponse,
  isUndefinedOrNull,
  mergeCursorData,
  useNonNullMultiQueryState,
  useToast,
  validateFetchMore,
} from 'erxes-ui';
import { useEffect } from 'react';

const OPPTYS_PER_PAGE = 30;

interface IOpptyChanged {
  opptyListChanged: {
    type: string;
    oppty: IOppty;
  };
}

export const useOpptysVariables = (
  variables?: QueryHookOptions<ICursorListResponse<IOppty>>['variables'],
) => {
  const { searchValue, assignee, priority, statusId } =
    useNonNullMultiQueryState<{
      searchValue: string;
      assignee: string;
      priority: string;
      statusId: string;
    }>(['searchValue', 'assignee', 'priority', 'statusId']);

  return {
    cursor: '',
    limit: OPPTYS_PER_PAGE,
    orderBy: {
      updatedAt: -1,
    },
    direction: 'forward',
    name: searchValue,
    assigneeId: assignee,
    priority: priority,
    statusId: statusId,
    ...variables,
  };
};

export const useOpptys = (
  projectId: string,
  options?: QueryHookOptions<ICursorListResponse<IOppty>>,
) => {
  const variables = useOpptysVariables(options?.variables);
  const { toast } = useToast();
  const { data, loading, fetchMore, subscribeToMore } = useQuery<
    ICursorListResponse<IOppty>
  >(GET_OPPTYS, {
    ...options,
    variables: { projectId, filter: variables },
    skip: options?.skip || isUndefinedOrNull(variables.cursor),
    fetchPolicy: 'cache-and-network',
    onError: (e) => {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      });
    },
  });

  const { list: opptys, pageInfo, totalCount } = data?.getOpptys || {};

  useEffect(() => {
    const unsubscribe = subscribeToMore<IOpptyChanged>({
      document: OPPTY_LIST_CHANGED,
      variables: { projectId, filter: variables },
      updateQuery: (prev, { subscriptionData }) => {
        if (!prev || !subscriptionData.data) return prev;

        const { type, oppty } = subscriptionData.data.opptyListChanged;
        const currentList = prev.getOpptys.list;

        let updatedList = currentList;

        if (type === 'create') {
          const exists = currentList.some(
            (item: IOppty) => item._id === oppty._id,
          );
          if (!exists) {
            updatedList = [oppty, ...currentList];
          }
        }

        if (type === 'update') {
          updatedList = currentList.map((item: IOppty) =>
            item._id === oppty._id ? { ...item, ...oppty } : item,
          );
        }

        if (type === 'remove') {
          updatedList = currentList.filter(
            (item: IOppty) => item._id !== oppty._id,
          );
        }

        return {
          ...prev,
          getOpptys: {
            ...prev.getOpptys,
            list: updatedList,
            pageInfo: prev.getOpptys.pageInfo,
            totalCount:
              type === 'create'
                ? prev.getOpptys.totalCount + 1
                : type === 'remove'
                ? prev.getOpptys.totalCount - 1
                : prev.getOpptys.totalCount,
          },
        };
      },
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables]);

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (!validateFetchMore({ direction, pageInfo })) {
      return;
    }

    fetchMore({
      variables: {
        projectId,
        filter: {
          ...variables,
          cursor:
            direction === EnumCursorDirection.FORWARD
              ? pageInfo?.endCursor
              : pageInfo?.startCursor,
          limit: OPPTYS_PER_PAGE,
          direction:
            direction === EnumCursorDirection.FORWARD ? 'forward' : 'backward',
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          getOpptys: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.getOpptys,
            prevResult: prev.getOpptys,
          }),
        });
      },
    });
  };

  return {
    loading,
    opptys,
    handleFetchMore,
    pageInfo,
    totalCount,
  };
};
