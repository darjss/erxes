import { Schema } from 'mongoose';
import { InvoiceItemType, InvoiceStatus } from '@/invoice/@types/invoice';

export const invoiceSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  lateDays: { type: Number },
  status: { type: String, enum: Object.values(InvoiceStatus), required: true },
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
});
