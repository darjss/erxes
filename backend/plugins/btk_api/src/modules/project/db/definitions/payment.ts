import { Schema, Types } from 'mongoose';

import {
  BtkProjectPaymentPlanFrequency,
  BtkProjectPaymentPlanInterestType,
  BtkProjectPaymentPlanType,
} from '@/project/@types/payment';

export const paymentPlanSchema = new Schema(
  {
    name: { type: String },
    project: {
      type: Types.ObjectId,
      ref: 'btk_projects',
      required: true,
    },
    downPaymentPercentage: { type: Number },
    interestPercentage: { type: Number },
    advancePaymentPercentage: { type: Number },
    discountPercentage: { type: Number },

    description: { type: String },
    type: { type: String, enum: Object.values(BtkProjectPaymentPlanType) },
    installment: { type: Number },
    frequency: {
      type: String,
      enum: Object.values(BtkProjectPaymentPlanFrequency),
    },
    interestType: {
      type: String,
      enum: Object.values(BtkProjectPaymentPlanInterestType),
    },
    penaltyPercentage: { type: Number },
    vatIncluded: { type: Boolean },
  },
  {
    timestamps: true,
  },
);
