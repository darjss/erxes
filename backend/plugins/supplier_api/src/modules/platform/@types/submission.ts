import { Document } from 'mongoose';

export interface ISubmissionOffering {
  price?: number;
  stock?: number;
  minBuyCount?: number;
  maxBuyCount?: number;
  groupBuyMinCount?: number;
  groupBuyDiscount?: number;
  warrantyDuration?: number;
}

export type SubmissionPlatform = 'mushop' | 'blockadmin';

export interface ISubmission {
  platform?: SubmissionPlatform;
  productId?: string;
  status?: string;
  note?: string;
  offering?: ISubmissionOffering;
  submittedAt?: Date;
  decidedAt?: Date;
}

export interface ISubmissionDocument extends ISubmission, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
