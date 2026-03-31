import { useQuery } from '@apollo/client';
import { GET_BLOCK_STATUSES } from '@/status/graphql/queries/getBlockStatuses';
import { IBlockStatus } from '@/status/types';

interface IUseGetBlockStatusesResponse {
  getBlockStatuses: IBlockStatus[];
}

export const useBlockStatusesByType = ({
  projectId,
  type,
}: {
  projectId: string;
  type?: string;
}) => {
  const { data, loading, refetch } = useQuery<IUseGetBlockStatusesResponse>(
    GET_BLOCK_STATUSES,
    {
      variables: {
        projectId,
        type,
      },
      skip: !projectId,
    },
  );

  const statuses = data?.getBlockStatuses;

  return { statuses, loading, refetch };
};
