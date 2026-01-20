import { IContext } from '~/connectionResolvers';
import { IActivityType } from '@/activity-type/@types/activityType';
import { updateProviderCategoriesFromActivityTypes } from '~/modules/activity-type/utils/updateProviderCategories';

export const activityTypeMutations = {
  async oneFitActivityTypeCreate(
    _root: undefined,
    doc: IActivityType,
    { models }: IContext,
  ) {
    if (!doc.name || !doc.name.en || !doc.name.mn) {
      throw new Error('Name must have both en and mn properties');
    }

    if (doc.categoryIds && doc.categoryIds.length > 0) {
      const categories = await models.ActivityCategory.find({
        _id: { $in: doc.categoryIds },
      });

      if (categories.length !== doc.categoryIds.length) {
        throw new Error('One or more category IDs are invalid');
      }
    }

    if (doc.providerId) {
      const provider = await models.Provider.findOne({ _id: doc.providerId });
      if (!provider) {
        throw new Error('Provider not found');
      }
    }

    const activityType = await models.ActivityType.createActivityType({
      ...doc,
      isActive: doc.isActive ?? true,
    });

    // Update provider categories based on active activity-types
    if (doc.providerId) {
      await updateProviderCategoriesFromActivityTypes(models, doc.providerId);
    }

    return activityType;
  },

  async oneFitActivityTypeUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IActivityType>,
    { models }: IContext,
  ) {
    const activityType = await models.ActivityType.findOne({ _id });

    if (!activityType) {
      throw new Error('Activity type not found');
    }

    if (doc.name) {
      if (!doc.name.en || !doc.name.mn) {
        throw new Error('Name must have both en and mn properties');
      }
    }

    if (doc.categoryIds && doc.categoryIds.length > 0) {
      const categories = await models.ActivityCategory.find({
        _id: { $in: doc.categoryIds },
      });

      if (categories.length !== doc.categoryIds.length) {
        throw new Error('One or more category IDs are invalid');
      }
    }

    const updatedActivityType = await models.ActivityType.updateActivityType(
      _id,
      { ...doc },
    );

    // Update provider categories if categoryIds or isActive changed
    if (doc.categoryIds !== undefined || doc.isActive !== undefined) {
      await updateProviderCategoriesFromActivityTypes(
        models,
        activityType.providerId,
      );
    }

    return updatedActivityType;
  },

  async oneFitActivityTypesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    // Get provider IDs before removing activity-types
    const activityTypesToRemove = await models.ActivityType.find({
      _id: { $in: ids },
    });
    const providerIds = new Set<string>();
    for (const activityType of activityTypesToRemove) {
      if (activityType.providerId) {
        providerIds.add(activityType.providerId);
      }
    }

    // Remove activity-types
    const result = await models.ActivityType.removeActivityTypes(ids);

    // Update provider categories for affected providers
    for (const providerId of providerIds) {
      await updateProviderCategoriesFromActivityTypes(models, providerId);
    }

    return result;
  },
};
