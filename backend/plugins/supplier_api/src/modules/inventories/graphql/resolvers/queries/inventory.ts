import { IContext } from '~/connectionResolvers';
import { InventoryQueryParams } from '@/inventories/@types/inventory';

export const inventoryQueries = {
  inventoryItem: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.InventoryItem.getInventoryItem(_id);
  },

  inventoryItems: async (
    _root: undefined,
    params: InventoryQueryParams,
    { models }: IContext,
  ) => {
    return models.InventoryItem.listInventoryItems(params);
  },

  safeRemainderItems: async (
    _root: undefined,
    { supplierId }: { supplierId: string },
    { models }: IContext,
  ) => {
    return models.InventoryItem.listSafeRemainderItems(supplierId);
  },
};
