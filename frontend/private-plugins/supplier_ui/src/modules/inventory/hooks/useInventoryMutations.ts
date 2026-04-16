import { useMutation } from '@apollo/client';
import {
  CREATE_INVENTORY_ITEM,
  UPDATE_INVENTORY_ITEM,
  ADJUST_INVENTORY_QUANTITY,
  REMOVE_INVENTORY_ITEM,
} from '../graphql/mutations';
import { GET_INVENTORY_ITEMS } from '../graphql/queries';

const refetchInventory = [{ query: GET_INVENTORY_ITEMS }];

export const useCreateInventoryItem = () => {
  const [mutate, { loading }] = useMutation(CREATE_INVENTORY_ITEM, {
    refetchQueries: refetchInventory,
  });
  return { createItem: mutate, loading };
};

export const useUpdateInventoryItem = () => {
  const [mutate, { loading }] = useMutation(UPDATE_INVENTORY_ITEM, {
    refetchQueries: refetchInventory,
  });
  return { updateItem: mutate, loading };
};

export const useAdjustInventoryQuantity = () => {
  const [mutate, { loading }] = useMutation(ADJUST_INVENTORY_QUANTITY, {
    refetchQueries: refetchInventory,
  });
  return { adjustQuantity: mutate, loading };
};

export const useRemoveInventoryItem = () => {
  const [mutate, { loading }] = useMutation(REMOVE_INVENTORY_ITEM, {
    refetchQueries: refetchInventory,
  });
  return { removeItem: mutate, loading };
};
