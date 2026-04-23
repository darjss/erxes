import { Resolver } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';
import { validateProviderOwnershipByProvider } from '~/utils/ownershipValidator';
import { requirePermission } from '~/utils/onefitPermissionCheck';

const MIN_RATING = 1;
const MAX_RATING = 5;

async function resolveBookingIdForReview(
  models: IContext['models'],
  bookingRef: string,
  userId: string,
  providerId: string,
): Promise<string> {
  const booking = await models.Booking.findOne({
    $or: [{ _id: bookingRef }, { bookingId: bookingRef }],
  });
  if (!booking) {
    throw new Error('Booking not found');
  }
  if (String(booking.userId) !== String(userId)) {
    throw new Error('Booking does not belong to this user');
  }
  if (String(booking.providerId) !== String(providerId)) {
    throw new Error('Booking does not match this provider');
  }
  return String(booking._id);
}

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
      bookingId: bookingRef,
      activityTypeId,
      rating,
      comment,
    }: {
      providerId: string;
      bookingId?: string | null;
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
      const activityType = await models.ActivityType.findOne({
        _id: activityTypeId,
      });
      if (!activityType) {
        throw new Error('Activity type not found');
      }
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    let resolvedBookingId: string | undefined;
    if (bookingRef) {
      resolvedBookingId = await resolveBookingIdForReview(
        models,
        bookingRef,
        userId,
        providerId,
      );
    }

    return models.ProviderReview.createProviderReview({
      providerId,
      userId,
      bookingId: resolvedBookingId,
      activityTypeId: activityTypeId ?? undefined,
      rating,
      comment: comment ?? undefined,
    });
  },

  async cpOneFitProviderReviewUpdate(
    _root: undefined,
    {
      _id,
      bookingId: bookingRef,
      activityTypeId,
      rating,
      comment,
    }: {
      _id: string;
      bookingId?: string | null;
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

    const userId = cpUser.erxesCustomerId || cpUser._id;

    const patch: Partial<{
      rating: number;
      comment: string;
      activityTypeId: string;
      bookingId: string;
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

    if (bookingRef !== undefined) {
      if (bookingRef) {
        const existing = await models.ProviderReview.findOne({
          _id,
          userId,
        });
        if (!existing) {
          throw new Error('Review not found or access denied');
        }
        patch.bookingId = await resolveBookingIdForReview(
          models,
          bookingRef,
          userId,
          String(existing.providerId),
        );
      } else {
        patch.bookingId = '';
      }
    }

    if (Object.keys(patch).length === 0) {
      throw new Error(
        'At least one of rating, comment, activityTypeId, or bookingId is required',
      );
    }

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

  async oneFitProviderReviewRemove(
    _root: undefined,
    {
      _id,
      providerId,
    }: {
      _id: string;
      providerId: string;
    },
    context: IContext,
  ) {
    await requirePermission(context, 'providerUpdate');
    const { models } = context;

    const provider = await models.Provider.findOne({ _id: providerId }).lean();
    if (!provider) {
      throw new Error('Provider not found');
    }
    validateProviderOwnershipByProvider(context, provider);

    const removed = await models.ProviderReview.removeProviderReviewAsAdmin(
      _id,
      providerId,
    );

    if (!removed) {
      throw new Error('Review not found');
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
