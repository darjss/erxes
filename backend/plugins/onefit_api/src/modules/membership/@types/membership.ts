import { Document } from 'mongoose';

export interface IMembershipPlan {
  saleOptions?: IMembershipSaleOption[];
  name: string;
  description?: string;
  creditAmount: number; // Number of credits
  planType: 'normal' | 'credit';
  duration?: number; // Duration in days (used only when planType is 'normal')
  price: number;
  isActive: boolean;
  gracePeriodDuration: number;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IMembershipSaleOption {
  quantity: number;
  discountPercent?: number;
  finalPrice?: number;
}

export interface IMembershipPlanDocument extends Document, IMembershipPlan {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
