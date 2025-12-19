import { getPureDate } from 'erxes-api-shared/utils';
import {
  IScheduleTemplateQueryParams,
  IScheduleExceptionQueryParams,
} from '../queries/schedule';

export function generateTemplateFilter(params: IScheduleTemplateQueryParams) {
  const filter: any = {};

  if (params.providerId) {
    filter.providerId = params.providerId;
  }

  if (params.year) {
    filter.year = params.year;
  }

  if (params.month) {
    filter.month = params.month;
  }

  if (params.activityTypeId) {
    filter['dailySchedules.activityTypeId'] = params.activityTypeId;
  }

  return filter;
}

export function generateExceptionFilter(params: IScheduleExceptionQueryParams) {
  const filter: any = {
    providerId: params.providerId,
  };

  if (params.startDate || params.endDate) {
    filter.date = {};
    if (params.startDate) {
      filter.date.$gte = getPureDate(params.startDate);
    }
    if (params.endDate) {
      filter.date.$lte = getPureDate(params.endDate);
    }
  }

  if (params.activityTypeId) {
    filter.activityTypeId = params.activityTypeId;
  }

  return filter;
}
