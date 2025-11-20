import { useQuery } from '@apollo/client';
import { BLOCK_ADMIN_GET_DEVELOPERS } from '../graphql/queries';
import { IDeveloperList } from '../types';

export const useDevelopers = () => {
  const { data, loading } = useQuery<{
    getBlockAdminDevelopers: IDeveloperList;
  }>(BLOCK_ADMIN_GET_DEVELOPERS);

  return { developers: data?.getBlockAdminDevelopers?.list, loading };
};
