import { Document } from 'mongoose';

export interface IMushopSubscriptionPlan {
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationMonths: number;
  isActive: boolean;
}

export interface IMushopSubscriptionPlanDocument
  extends IMushopSubscriptionPlan,
    Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
