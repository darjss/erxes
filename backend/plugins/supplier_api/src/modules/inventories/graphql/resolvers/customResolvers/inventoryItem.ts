import { IInventoryItemDocument } from '@/inventories/@types/inventory';

export const InventoryItem = {
  isBelowSafeRemainder: (item: IInventoryItemDocument): boolean => {
    const safeRemainder = item.safeRemainder ?? 0;
    return item.quantity <= safeRemainder;
  },
};
