import { getPureDate } from 'erxes-api-shared/utils';
import {
  IScheduleTemplateQueryParams,
  IScheduleExceptionQueryParams,
} from '../queries/schedule';
import { IContext } from '~/connectionResolvers';
import { addInstanceIdFilter } from '~/utils/providerFilter';

export async function generateTemplateFilter(
  params: IScheduleTemplateQueryParams,
  context?: IContext,
) {
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

  // Add instanceId filtering if context is provided
  if (context) {
    return await addInstanceIdFilter(context, filter);
  }

  return filter;
}

export async function generateExceptionFilter(
  params: IScheduleExceptionQueryParams,
  context?: IContext,
) {
  const filter: any = {};

  // providerId is required for exceptions
  if (params.providerId) {
    filter.providerId = params.providerId;
  }

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

  // Add instanceId filtering if context is provided
  if (context) {
    return await addInstanceIdFilter(context, filter);
  }

  return filter;
}
