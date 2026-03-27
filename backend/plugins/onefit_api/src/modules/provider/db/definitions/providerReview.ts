import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { IProviderReviewDocument } from '@/provider/@types/providerReview';

const MIN_RATING = 1;
const MAX_RATING = 5;

export const providerReviewSchema = new Schema<IProviderReviewDocument>(
  {
    _id: mongooseStringRandomId,
    providerId: {
      type: String,
      required: true,
      index: true,
      label: 'Provider ID',
    },
    userId: {
      type: String,
      required: true,
      index: true,
      label: 'User ID',
    },
    rating: {
      type: Number,
      required: true,
      min: MIN_RATING,
      max: MAX_RATING,
      label: 'Rating',
    },
    comment: { type: String, label: 'Comment' },
  },
  {
    timestamps: true,
  },
);

providerReviewSchema.index({ providerId: 1, createdAt: -1 });
