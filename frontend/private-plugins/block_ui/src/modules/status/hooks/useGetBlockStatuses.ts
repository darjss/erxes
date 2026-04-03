import { useMemo } from 'react';
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
      },
      skip: !projectId,
    },
  );

  const statuses = useMemo(() => {
    const all = data?.getBlockStatuses || [];

    if (!type) return all;

    return all.filter((status) => status.type === type);
    
  }, [data?.getBlockStatuses, type]);

  return { statuses, loading, refetch };
};
