import { Document } from 'mongoose';

export interface IInventoryItem {
  supplierId: string;
  productId: string;
  barcode?: string;
  quantity: number;
  safeRemainder?: number;
  status?: string;
  notes?: string;
}

export interface IInventoryItemDocument extends IInventoryItem, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryQueryParams {
  supplierId?: string;
  status?: string;
  isBelowSafeRemainder?: boolean;
}
