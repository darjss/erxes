import { useQuery } from '@apollo/client';
import { GET_INVENTORY_ITEM_DETAIL } from '../graphql/inventoryDetail';
import { IInventoryItem } from '../types';

export const useInventoryDetail = (_id?: string | null) => {
  const { data, loading } = useQuery<{ inventoryItem: IInventoryItem }>(
    GET_INVENTORY_ITEM_DETAIL,
    { variables: { _id }, skip: !_id },
  );
  return { item: data?.inventoryItem ?? null, loading };
};
