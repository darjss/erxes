import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { ICustomerSubscriptionDocument } from '@/subscription/@types/customerSubscription';
import { SUBSCRIPTION_STATUS } from '~/constants';

export const customerSubscriptionSchema =
  new Schema<ICustomerSubscriptionDocument>(
    {
      _id: mongooseStringRandomId,
      cpUserId: { type: String, required: true, index: true },
      erxesCustomerId: { type: String, index: true },
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
