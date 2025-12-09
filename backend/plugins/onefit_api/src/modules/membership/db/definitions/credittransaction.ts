import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';

export const creditTransactionSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },

    userId: { type: String, required: true, index: true, label: 'User ID' },
    amount: { type: Number, required: true, label: 'Amount' },
    transactionType: {
      type: String,
      enum: Object.values(CreditTransactionType),
      required: true,
      label: 'Transaction Type',
    },
    source: {
      type: String,
      enum: Object.values(CreditSource),
      required: true,
      default: CreditSource.INDIVIDUAL,
      label: 'Credit Source',
    },
    bookingId: { type: String, label: 'Booking ID' },
    corporateCreditId: {
      type: String,
      index: true,
      label: 'Corporate Credit ID',
    },
    description: { type: String, label: 'Description' },
    balanceAfter: { type: Number, required: true, label: 'Balance After' },
  },
  {
    timestamps: true,
  },
);

creditTransactionSchema.index({ userId: 1, createdAt: -1 });
creditTransactionSchema.index({ bookingId: 1 });
