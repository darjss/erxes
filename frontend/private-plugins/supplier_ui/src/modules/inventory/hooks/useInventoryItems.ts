import { useQuery } from '@apollo/client';
import { useMultiQueryState } from 'erxes-ui';
import { GET_INVENTORY_ITEMS } from '../graphql/queries';
import { IInventoryList } from '../types';

export const useInventoryItems = (supplierId?: string) => {
  const [{ status, isBelowSafeRemainder }] = useMultiQueryState<{
    status: string;
    isBelowSafeRemainder: string;
  }>(['status', 'isBelowSafeRemainder']);

  const variables = {
    supplierId: supplierId || undefined,
    status: status || undefined,
    isBelowSafeRemainder: isBelowSafeRemainder === 'true' ? true : undefined,
  };

  const { data, loading, refetch } = useQuery<{
    inventoryItems: IInventoryList;
  }>(GET_INVENTORY_ITEMS, { variables });

  return {
    items: data?.inventoryItems?.list || [],
    totalCount: data?.inventoryItems?.totalCount,
    loading,
    refetch,
  };
};
