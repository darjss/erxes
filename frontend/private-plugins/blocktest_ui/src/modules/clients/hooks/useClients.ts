import {
  EnumCursorDirection,
  ICursorListResponse,
  mergeCursorData,
  validateFetchMore,
} from 'erxes-ui';
import {
  GET_CV_CLIENT_DETAIL,
  GET_CV_CLIENTS,
} from '../graphql/cvClientsQueries';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { ICVClient } from '../clientsTypes';
import { useEffect } from 'react';
import { clientsTotalCountAtom } from '../states/clientsTotalCountAtom';
import { useSetAtom } from 'jotai';

export const useClientDetail = ({ id }: { id: string }) => {
  const { data, loading, error } = useQuery(GET_CV_CLIENT_DETAIL, {
    variables: { id },
  });
  return {
    clientDetail: data?.getCVClientDetail,
    loading,
    error,
  };
};

export const useClients = (
  options?: QueryHookOptions<ICursorListResponse<ICVClient>>,
) => {
  const setClientsTotalCount = useSetAtom(clientsTotalCountAtom);

  const { data, loading, error, fetchMore } = useQuery<
    ICursorListResponse<ICVClient>
  >(GET_CV_CLIENTS, {
    variables: {
      ...options?.variables,
    },
  });
  const { list: clients, pageInfo, totalCount } = data?.getCVClients || {};

  useEffect(() => {
    if (!totalCount) return;
    setClientsTotalCount(totalCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount]);

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
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        limit: 30,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          getCVClients: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.getCVClients,
            prevResult: prev.getCVClients,
          }),
        });
      },
    });
  };

  return {
    clients,
    pageInfo,
    totalCount,
    loading,
    error,
    handleFetchMore,
  };
};
