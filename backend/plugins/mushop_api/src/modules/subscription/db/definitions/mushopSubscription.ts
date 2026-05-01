import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { IMushopSubscriptionDocument } from '@/subscription/@types/mushopSubscription';
import { SUBSCRIPTION_STATUS } from '~/constants';

export const mushopSubscriptionSchema =
  new Schema<IMushopSubscriptionDocument>(
    {
      _id: mongooseStringRandomId,
      customerId: { type: String, required: true, index: true },
      planId: { type: String, index: true },
      status: {
        type: String,
        enum: SUBSCRIPTION_STATUS.ALL,
        default: SUBSCRIPTION_STATUS.ACTIVE,
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      amount: { type: Number },
      currency: { type: String, default: 'MNT' },
      invoiceId: { type: String },
    },
    { timestamps: true },
  );
