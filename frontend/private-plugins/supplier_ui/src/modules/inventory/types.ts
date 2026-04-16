export interface IInventoryItem {
  _id: string;
  supplierId: string;
  productId: string;
  barcode?: string;
  quantity: number;
  safeRemainder?: number;
  status?: string;
  notes?: string;
  isBelowSafeRemainder?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInventoryList {
  list: IInventoryItem[];
  totalCount?: number;
}

export type InventoryItemFormValues = {
  productId: string;
  barcode?: string;
  quantity: number;
  safeRemainder?: number;
  status?: string;
  notes?: string;
};
