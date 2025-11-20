import { Schema, Types } from 'mongoose';

import {
  BtkNewsPaymentPlanFrequency,
  BtkNewsPaymentPlanInterestType,
  BtkNewsPaymentPlanType,
} from '~/modules/news/@types/payment';
import { schemaWrapper } from '~/utils';

export const paymentPlanSchema = schemaWrapper(
  new Schema(
    {
      name: { type: String },
      news: {
        type: Types.ObjectId,
        ref: 'btk_news',
        required: true,
      },
      downPaymentPercentage: { type: Number },
      interestPercentage: { type: Number },
      advancePaymentPercentage: { type: Number },
      discountPercentage: { type: Number },

      description: { type: String },
      type: { type: String, enum: Object.values(BtkNewsPaymentPlanType) },
      installment: { type: Number },
      frequency: {
        type: String,
        enum: Object.values(BtkNewsPaymentPlanFrequency),
      },
      interestType: {
        type: String,
        enum: Object.values(BtkNewsPaymentPlanInterestType),
      },
      penaltyPercentage: { type: Number },
      vatIncluded: { type: Boolean },
    },
    {
      timestamps: true,
    },
  ),
);
