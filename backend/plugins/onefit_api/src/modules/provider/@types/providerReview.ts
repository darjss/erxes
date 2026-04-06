import { Document } from 'mongoose';

export interface IProviderReview {
  providerId: string;
  userId: string;
  /** Resolved MongoDB `_id` of the linked booking (mutation accepts `_id` or `booking.bookingId`) */
  bookingId?: string;
  activityTypeId?: string;
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
