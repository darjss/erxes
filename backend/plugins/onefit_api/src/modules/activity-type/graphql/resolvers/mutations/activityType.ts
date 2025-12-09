import { IContext } from '~/connectionResolvers';
import { IActivityType } from '@/activity-type/@types/activityType';

export const activityTypeMutations = {
  async oneFitActivityTypeCreate(
    _root: undefined,
    doc: IActivityType,
    { models }: IContext,
  ) {
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

    return await models.ActivityType.createActivityType({
      ...doc,
      isActive: doc.isActive ?? true,
    });
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

    if (doc.categoryIds && doc.categoryIds.length > 0) {
      const categories = await models.ActivityCategory.find({
        _id: { $in: doc.categoryIds },
      });

      if (categories.length !== doc.categoryIds.length) {
        throw new Error('One or more category IDs are invalid');
      }
    }

    return await models.ActivityType.updateActivityType(_id, { ...doc });
  },

  async oneFitActivityTypesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.ActivityType.removeActivityTypes(ids);
  },
};
