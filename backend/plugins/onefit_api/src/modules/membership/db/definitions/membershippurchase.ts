import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { MembershipPurchaseStatus } from '@/membership/@types/membershippurchase';

export const membershipPurchaseSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    userId: {
      type: String,
      required: true,
      index: true,
      label: 'User ID',
    },
    planId: {
      type: String,
      required: true,
      index: true,
      label: 'Membership Plan ID',
    },
    status: {
      type: String,
      enum: Object.values(MembershipPurchaseStatus),
      required: true,
      default: MembershipPurchaseStatus.PENDING,
      index: true,
      label: 'Purchase Status',
    },
    purchasedAt: {
      type: Date,
      required: true,
      default: Date.now,
      label: 'Purchased At',
    },
    paidAt: {
      type: Date,
      label: 'Paid At',
    },
    activatedAt: {
      type: Date,
      label: 'Activated At',
    },
    expiresAt: {
      type: Date,
      label: 'Expires At',
    },
    amount: {
      type: Number,
      required: true,
      label: 'Purchase Amount',
    },
  },
  {
    timestamps: true,
  },
);

membershipPurchaseSchema.index({ userId: 1, createdAt: -1 });
membershipPurchaseSchema.index({ userId: 1, status: 1 });
membershipPurchaseSchema.index({ planId: 1 });
