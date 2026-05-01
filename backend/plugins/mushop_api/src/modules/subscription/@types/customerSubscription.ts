import { Document } from 'mongoose';

export interface ICustomerSubscription {
  cpUserId: string;
  erxesCustomerId?: string;
  status: string;
  startDate: Date;
  endDate: Date;
  amount?: number;
  currency?: string;
  invoiceId?: string;
}

export interface ICustomerSubscriptionDocument
  extends ICustomerSubscription,
    Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
