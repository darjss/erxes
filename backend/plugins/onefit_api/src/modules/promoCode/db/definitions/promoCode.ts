import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { PromoCodeDiscountType } from '@/promoCode/@types/promoCode';

export const promoCodeSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    code: {
      type: String,
      required: true,
      unique: true,
      label: 'Code',
    },
    discountType: {
      type: String,
      enum: Object.values(PromoCodeDiscountType),
      required: true,
      label: 'Discount Type',
    },
    value: {
      type: Number,
      required: true,
      label: 'Value',
    },
    isCompanyTag: {
      type: Boolean,
      default: false,
      label: 'Company Tag',
    },
    validFrom: { type: Date, label: 'Valid From' },
    validTo: { type: Date, label: 'Valid To' },
    usageLimit: { type: Number, label: 'Usage Limit' },
    usedCount: {
      type: Number,
      default: 0,
      label: 'Used Count',
    },
    isActive: {
      type: Boolean,
      default: true,
      label: 'Is Active',
    },
  },
  {
    timestamps: true,
  },
);

promoCodeSchema.index({ code: 1 }, { unique: true });
promoCodeSchema.index({ isActive: 1 });
promoCodeSchema.index({ validFrom: 1 });
promoCodeSchema.index({ validTo: 1 });
