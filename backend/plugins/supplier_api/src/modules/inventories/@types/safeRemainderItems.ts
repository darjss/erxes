import { IInventoryItemDocument } from './inventory';

export interface ISafeRemainderItem extends IInventoryItemDocument {
  shortage: number; // safeRemainder - quantity
}

export interface SafeRemainderQueryParams {
  supplierId?: string;
}
