import { IActivityTypeDocument } from '@/activity-type/@types/activityType';
import { IContext } from '~/connectionResolvers';

const activityTypeCustomResolvers = {
  OneFitActivityType: {
    provider: async (
      activityType: IActivityTypeDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!activityType.providerId) {
        return null;
      }
      return await models.Provider.findOne({ _id: activityType.providerId });
    },

    categories: async (
      activityType: IActivityTypeDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!activityType.categoryIds || activityType.categoryIds.length === 0) {
        return [];
      }
      return await models.ActivityCategory.find({
        _id: { $in: activityType.categoryIds },
      });
    },
  },
  OneFitActivityTypeWithAvailability: {
    provider: async (
      activityType: any,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!activityType.providerId) {
        return null;
      }
      return await models.Provider.findOne({ _id: activityType.providerId });
    },

    categories: async (
      activityType: any,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!activityType.categoryIds || activityType.categoryIds.length === 0) {
        return [];
      }
      return await models.ActivityCategory.find({
        _id: { $in: activityType.categoryIds },
      });
    },
  },
};

export default activityTypeCustomResolvers;
