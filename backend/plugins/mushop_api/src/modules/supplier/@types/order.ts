import { Document } from 'mongoose';

export const ORDER_STATUS = {
  PENDING: 'pending',
  FORWARDED: 'forwarded',
  FAILED: 'failed',
  ALL: ['pending', 'forwarded', 'failed'],
};

export interface IOrder {
  // Supplier subdomain the order was routed to.
  subdomain?: string;
  posToken?: string;
  // The order payload forwarded to the supplier (after product-id remap).
  order?: any;
  status?: string;
  // Order id returned by the supplier server on success.
  entityId?: string | null;
  error?: string | null;
}

export interface IOrderDocument extends IOrder, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
