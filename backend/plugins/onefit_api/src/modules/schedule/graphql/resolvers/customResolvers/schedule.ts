import {
  IScheduleTemplateDocument,
  IScheduleExceptionDocument,
} from '@/schedule/@types/schedule';
import { IContext } from '~/connectionResolvers';

const scheduleTemplateCustomResolvers = {
  OneFitScheduleTemplate: {
    provider: async (
      scheduleTemplate: IScheduleTemplateDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!scheduleTemplate.providerId) {
        return null;
      }
      return await models.Provider.findOne({
        _id: scheduleTemplate.providerId,
      });
    },
  },
  OneFitScheduleException: {
    provider: async (
      scheduleException: IScheduleExceptionDocument,
      _params: undefined,
      { models }: IContext,
    ) => {
      if (!scheduleException.providerId) {
        return null;
      }
      return await models.Provider.findOne({
        _id: scheduleException.providerId,
      });
    },
  },
};

export default scheduleTemplateCustomResolvers;
