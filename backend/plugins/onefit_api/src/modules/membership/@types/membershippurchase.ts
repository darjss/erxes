import { Document } from 'mongoose';

export enum MembershipPurchaseStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export interface IMembershipPurchase {
  userId: string;
  companyId?: string;
  planId: string;
  status: MembershipPurchaseStatus;
  purchasedAt: Date;
  paidAt?: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  amount: number;
  invoiceId?: string;
  promoCodeId?: string;
  removePreviousCredits?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IMembershipPurchaseDocument
  extends Document, IMembershipPurchase {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
