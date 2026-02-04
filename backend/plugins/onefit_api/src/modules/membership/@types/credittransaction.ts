import { Document } from 'mongoose';

export enum CreditTransactionType {
  PURCHASE = 'purchase',
  USAGE = 'usage',
  REFUND = 'refund',
  EXPIRATION = 'expiration',
}

export enum CreditSource {
  INDIVIDUAL = 'individual',
  CORPORATE = 'corporate',
}

export interface ICreditTransaction {
  userId: string;
  amount: number; // Positive for credit, negative for debit
  transactionType: CreditTransactionType;
  source: CreditSource;
  bookingId?: string; // Reference to Booking
  corporateCreditId?: string; // Reference to CorporateCredit
  companyId?: string; // Reference to Company (core) for corporate transactions
  description?: string;
  balanceAfter: number; // Balance after this transaction
  createdAt?: Date;
}

export interface ICreditTransactionDocument
  extends Document,
    ICreditTransaction {
  _id: string;
  createdAt: Date;
}
