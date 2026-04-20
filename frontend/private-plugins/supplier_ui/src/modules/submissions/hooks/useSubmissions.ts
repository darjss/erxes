import { useQuery } from '@apollo/client';
import {
  EnumCursorDirection,
  mergeCursorData,
  useQueryState,
  validateFetchMore,
} from 'erxes-ui';
import { PLATFORM_SUBMISSIONS } from '../graphql/queries';
import { ISubmissionList } from '../types';

const LIMIT = 20;

export const useSubmissions = () => {
  const [status] = useQueryState<string>('status');

  const variables = { status: status || undefined, limit: LIMIT };

  const { data, loading, fetchMore, refetch } = useQuery<{
    supplierSubmissions: ISubmissionList;
  }>(PLATFORM_SUBMISSIONS, { variables });

  const { list: submissions, totalCount, pageInfo } = data?.supplierSubmissions || {};

  const handleFetchMore = (
    direction: EnumCursorDirection = EnumCursorDirection.FORWARD,
  ) => {
    if (!validateFetchMore({ direction, pageInfo })) return;

    fetchMore({
      variables: {
        ...variables,
        cursor:
          direction === EnumCursorDirection.FORWARD
            ? pageInfo?.endCursor
            : pageInfo?.startCursor,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          supplierSubmissions: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.supplierSubmissions,
            prevResult: prev.supplierSubmissions,
          }),
        };
      },
    });
  };

  return { submissions, loading, totalCount, pageInfo, handleFetchMore, refetch };
};
