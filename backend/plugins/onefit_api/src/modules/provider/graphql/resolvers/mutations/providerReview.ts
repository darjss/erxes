import { Resolver } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

const MIN_RATING = 1;
const MAX_RATING = 5;

function assertRating(value: number) {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    value < MIN_RATING ||
    value > MAX_RATING
  ) {
    throw new Error(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`);
  }
}

export const providerReviewMutations: Record<string, Resolver> = {
  async cpOneFitProviderReviewAdd(
    _root: undefined,
    {
      providerId,
      activityTypeId,
      rating,
      comment,
    }: {
      providerId: string;
      activityTypeId?: string | null;
      rating: number;
      comment?: string | null;
    },
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    assertRating(rating);

    const provider = await models.Provider.findOne({ _id: providerId });
    if (!provider) {
      throw new Error('Provider not found');
    }

    if (activityTypeId) {
      const activityType = await models.ActivityType.findOne({ _id: activityTypeId });
      if (!activityType) {
        throw new Error('Activity type not found');
      }
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    return models.ProviderReview.createProviderReview({
      providerId,
      userId,
      activityTypeId: activityTypeId ?? undefined,
      rating,
      comment: comment ?? undefined,
    });
  },

  async cpOneFitProviderReviewUpdate(
    _root: undefined,
    {
      _id,
      activityTypeId,
      rating,
      comment,
    }: {
      _id: string;
      activityTypeId?: string | null;
      rating?: number | null;
      comment?: string | null;
    },
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const patch: Partial<{
      rating: number;
      comment: string;
      activityTypeId: string;
    }> = {};
    if (rating !== undefined && rating !== null) {
      assertRating(rating);
      patch.rating = rating;
    }
    if (comment !== undefined) {
      patch.comment = comment ?? '';
    }
    if (activityTypeId !== undefined) {
      if (activityTypeId) {
        const activityType = await models.ActivityType.findOne({
          _id: activityTypeId,
        });
        if (!activityType) {
          throw new Error('Activity type not found');
        }
      }

      patch.activityTypeId = activityTypeId ?? '';
    }

    if (Object.keys(patch).length === 0) {
      throw new Error(
        'At least one of rating, comment, or activityTypeId is required',
      );
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    const updated = await models.ProviderReview.updateProviderReview(
      _id,
      userId,
      patch,
    );

    if (!updated) {
      throw new Error('Review not found or access denied');
    }

    return updated;
  },

  async cpOneFitProviderReviewRemove(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const removed = await models.ProviderReview.removeProviderReview(
      _id,
      userId,
    );

    if (!removed) {
      throw new Error('Review not found or access denied');
    }

    return {
      deletedCount: 1,
      _id: removed._id,
    };
  },
};

providerReviewMutations.cpOneFitProviderReviewAdd.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

providerReviewMutations.cpOneFitProviderReviewUpdate.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

providerReviewMutations.cpOneFitProviderReviewRemove.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};
