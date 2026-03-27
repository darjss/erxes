import { Document } from 'mongoose';

export interface IProviderReview {
  providerId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IProviderReviewDocument extends Document, IProviderReview {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IProviderReviewSummary {
  averageRating: number;
  reviewCount: number;
}
