import { Document } from 'mongoose';

export interface IMembershipPlan {
  name: string;
  description?: string;
  creditAmount: number; // Number of credits
  duration: number; // Duration in days (typically 30)
  price: number;
  isActive: boolean;
  gracePeriodDuration: number;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IMembershipPlanDocument extends Document, IMembershipPlan {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
