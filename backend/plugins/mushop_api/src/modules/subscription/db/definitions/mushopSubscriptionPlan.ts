import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { IMushopSubscriptionPlanDocument } from '@/subscription/@types/mushopSubscriptionPlan';

export const mushopSubscriptionPlanSchema =
  new Schema<IMushopSubscriptionPlanDocument>(
    {
      _id: mongooseStringRandomId,
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      currency: { type: String, default: 'MNT' },
      durationMonths: { type: Number, required: true, default: 12 },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
  );
