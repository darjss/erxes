import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  generateTemplateFilter,
  generateExceptionFilter,
} from '../utils/filters';

export interface IScheduleTemplateQueryParams extends ICursorPaginateParams {
  providerId?: string;
  year?: number;
  month?: number;
  activityTypeId?: string;
}

export interface IScheduleExceptionQueryParams extends ICursorPaginateParams {
  providerId: string;
  startDate?: Date;
  endDate?: Date;
  activityTypeId?: string;
}

export const scheduleQueries = {
  async oneFitScheduleTemplates(
    _root: undefined,
    params: IScheduleTemplateQueryParams,
    { models }: IContext,
  ) {
    const filter = generateTemplateFilter(params);

    return await cursorPaginate({
      model: models.ScheduleTemplate,
      params,
      query: filter,
    });
  },

  async oneFitScheduleTemplatesCount(
    _root: undefined,
    params: IScheduleTemplateQueryParams,
    { models }: IContext,
  ) {
    const filter = generateTemplateFilter(params);
    return models.ScheduleTemplate.find(filter).countDocuments();
  },

  async oneFitScheduleTemplate(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.ScheduleTemplate.findOne({ _id });
  },

  async oneFitScheduleTemplateByProviderAndMonth(
    _root: undefined,
    {
      providerId,
      year,
      month,
    }: { providerId: string; year: number; month: number },
    { models }: IContext,
  ) {
    return models.ScheduleTemplate.findByProviderAndMonth(
      providerId,
      year,
      month,
    );
  },

  async oneFitScheduleExceptions(
    _root: undefined,
    params: IScheduleExceptionQueryParams,
    { models }: IContext,
  ) {
    const filter = generateExceptionFilter(params);
    return await cursorPaginate({
      model: models.ScheduleException,
      params,
      query: filter,
    });
  },

  async oneFitScheduleExceptionsCount(
    _root: undefined,
    params: IScheduleExceptionQueryParams,
    { models }: IContext,
  ) {
    const filter = generateExceptionFilter(params);
    return models.ScheduleException.find(filter).countDocuments();
  },

  async oneFitScheduleException(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.ScheduleException.findOne({ _id });
  },
};
markResolvers(scheduleQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
