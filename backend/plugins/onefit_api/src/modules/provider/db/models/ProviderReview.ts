import {
  IProviderReview,
  IProviderReviewDocument,
  IProviderReviewSummary,
} from '@/provider/@types/providerReview';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { providerReviewSchema } from '../definitions/providerReview';

export interface IProviderReviewModel extends Model<IProviderReviewDocument> {
  createProviderReview(doc: IProviderReview): Promise<IProviderReviewDocument>;
  updateProviderReview(
    _id: string,
    userId: string,
    doc: Partial<Pick<IProviderReview, 'rating' | 'comment'>>,
  ): Promise<IProviderReviewDocument | null>;
  removeProviderReview(
    _id: string,
    userId: string,
  ): Promise<IProviderReviewDocument | null>;
  getSummaryForProvider(providerId: string): Promise<IProviderReviewSummary>;
}

export const loadProviderReviewClass = (models: IModels) => {
  class ProviderReview {
    public static async createProviderReview(doc: IProviderReview) {
      return models.ProviderReview.create(doc);
    }

    public static async updateProviderReview(
      _id: string,
      userId: string,
      doc: Partial<Pick<IProviderReview, 'rating' | 'comment'>>,
    ) {
      const existing = await models.ProviderReview.findOne({ _id, userId });
      if (!existing) {
        return null;
      }
      const next: Record<string, unknown> = { modifiedAt: new Date() };
      if (doc.rating !== undefined) {
        next.rating = doc.rating;
      }
      if (doc.comment !== undefined) {
        next.comment = doc.comment;
      }
      return models.ProviderReview.findOneAndUpdate(
        { _id, userId },
        { $set: next },
        { new: true },
      );
    }

    public static async removeProviderReview(_id: string, userId: string) {
      return models.ProviderReview.findOneAndDelete({ _id, userId });
    }

    public static async getSummaryForProvider(providerId: string) {
      const agg = await models.ProviderReview.aggregate([
        { $match: { providerId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 },
          },
        },
      ]);
      if (!agg.length) {
        return { averageRating: 0, reviewCount: 0 };
      }
      const row = agg[0];
      return {
        averageRating: row.averageRating ?? 0,
        reviewCount: row.reviewCount ?? 0,
      };
    }
  }

  providerReviewSchema.loadClass(ProviderReview);

  return providerReviewSchema;
};
