import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const membershipPlanSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    name: { type: String, required: true, label: 'Plan Name' },
    description: { type: String, label: 'Description' },
    creditAmount: { type: Number, required: true, label: 'Credit Amount' },
    planType: {
      type: String,
      enum: ['normal', 'credit'],
      default: 'normal',
      label: 'Plan Type',
    },
    duration: {
      type: Number,
      default: 30,
      label: 'Duration (days)',
    },
    price: { type: Number, required: true, label: 'Price' },
    saleOptions: [
      {
        quantity: { type: Number, required: true, min: 2, label: 'Quantity' },
        discountPercent: {
          type: Number,
          min: 0,
          max: 100,
          label: 'Discount Percent',
        },
        finalPrice: { type: Number, min: 0, label: 'Final Price' },
      },
    ],
    isActive: { type: Boolean, default: true, label: 'Is Active' },
    gracePeriodDuration: {
      type: Number,
      required: true,
      default: 7,
      label: 'Grace Period Duration (days)',
    },
  },
  {
    timestamps: true,
  },
);
