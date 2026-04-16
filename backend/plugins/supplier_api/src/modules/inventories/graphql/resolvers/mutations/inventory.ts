import { IContext } from '~/connectionResolvers';
import {
  IInventoryItem,
} from '@/inventories/@types/inventory';

export const inventoryMutations = {
  inventoryItemCreate: async (
    _root: undefined,
    { supplierId, input }: { supplierId: string; input: IInventoryItem },
    { models }: IContext,
  ) => {
    return models.InventoryItem.createInventoryItem(supplierId, input);
  },

  inventoryItemUpdate: async (
    _root: undefined,
    {
      _id,
      supplierId,
      input,
    }: { _id: string; supplierId: string; input: Partial<IInventoryItem> },
    { models }: IContext,
  ) => {
    return models.InventoryItem.updateInventoryItem(_id, supplierId, input);
  },

  inventoryItemAdjustQuantity: async (
    _root: undefined,
    {
      _id,
      supplierId,
      delta,
    }: { _id: string; supplierId: string; delta: number },
    { models }: IContext,
  ) => {
    return models.InventoryItem.adjustQuantity(_id, supplierId, delta);
  },

  inventoryItemRemove: async (
    _root: undefined,
    { _id, supplierId }: { _id: string; supplierId: string },
    { models }: IContext,
  ) => {
    return models.InventoryItem.removeInventoryItem(_id, supplierId);
  },
};
