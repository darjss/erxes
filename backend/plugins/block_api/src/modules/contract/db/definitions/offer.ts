import { Schema } from 'mongoose';
import {
  BlockProjectPaymentPlanFrequency,
  BlockProjectPaymentPlanInterestType,
  BlockProjectPaymentPlanType,
} from '@/project/@types/payment';
import { ContractPartyType } from '@/contract/@types/contract';
import { OfferStatus, OfferAmountType } from '@/contract/@types/offer';

const offerPartySchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ContractPartyType),
      required: true,
    },
    id: { type: String, required: true },
  },
  { _id: false },
);

const offerPaymentPlanSchema = new Schema(
  {
    downPaymentPercentage: { type: Number },
    description: { type: String },
    interestPercentage: { type: Number },
    interestType: {
      type: String,
      enum: Object.values(BlockProjectPaymentPlanInterestType),
    },
    completionPaymentPercentage: { type: Number },
    discountPercentage: { type: Number },
    installment: { type: Number },
    frequency: {
      type: String,
      enum: Object.values(BlockProjectPaymentPlanFrequency),
    },
    penaltyPercentage: { type: Number },
    vatIncluded: { type: Boolean },
    type: { type: String, enum: Object.values(BlockProjectPaymentPlanType) },
    paymentDates: { type: [Number] },
    firstPaymentDate: { type: Date },
    completionPaymentDate: { type: Date },
  },
  { _id: false },
);

export const offerSchema = new Schema(
  {
    number: { type: String, required: true },
    currency: { type: String, required: true },
    unit: { type: Schema.Types.ObjectId, ref: 'block_units', required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    amountType: { type: String, enum: Object.values(OfferAmountType) },
    endDate: { type: Date },
    party: { type: offerPartySchema, required: true },
    description: { type: String },
    paymentPlan: { type: offerPaymentPlanSchema, required: true },
    status: {
      type: String,
      enum: Object.values(OfferStatus),
      default: OfferStatus.DRAFT,
    },
    user: { type: String },
  },
  { timestamps: true },
);
