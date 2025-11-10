import { InvoiceItemType, InvoiceStatus } from '@/invoice/@types/invoice';
import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const invoiceSchema = schemaWrapper(
  new Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    lateDays: { type: Number },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      required: true,
    },
    number: { type: Number, required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    itemType: {
      type: String,
      enum: Object.values(InvoiceItemType),
      required: true,
    },
    description: { type: String },
    paidDate: { type: Date },
    customDate: { type: String },
  }),
);
