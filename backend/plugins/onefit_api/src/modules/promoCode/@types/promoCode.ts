import { Document } from 'mongoose';

export const PromoCodeDiscountType = {
  PERCENT: 'percent',
  FIXED: 'fixed',
} as const;

export type PromoCodeDiscountTypeValue =
  (typeof PromoCodeDiscountType)[keyof typeof PromoCodeDiscountType];

export interface IPromoCode {
  code: string;
  discountType: PromoCodeDiscountTypeValue;
  value: number;
  isCompanyTag?: boolean;
  validFrom?: Date;
  validTo?: Date;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IPromoCodeDocument extends Document, IPromoCode {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
