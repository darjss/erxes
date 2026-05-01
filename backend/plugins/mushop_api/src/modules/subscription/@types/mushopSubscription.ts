import { Document } from 'mongoose';

export interface IMushopSubscription {
  customerId: string;
  planId?: string;
  status: string;
  startDate: Date;
  endDate: Date;
  amount?: number;
  currency?: string;
  invoiceId?: string;
}

export interface IMushopSubscriptionDocument
  extends IMushopSubscription,
    Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
