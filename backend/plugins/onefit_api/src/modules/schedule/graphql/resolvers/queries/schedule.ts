import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  getPureDate,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export interface IScheduleTemplateQueryParams extends ICursorPaginateParams {
  providerId?: string;
  year?: number;
  month?: number;
}

export interface IScheduleExceptionQueryParams extends ICursorPaginateParams {
  providerId: string;
  startDate?: Date;
  endDate?: Date;
}

const generateTemplateFilter = (params: IScheduleTemplateQueryParams) => {
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

  return filter;
};

const generateExceptionFilter = (params: IScheduleExceptionQueryParams) => {
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

  return filter;
};

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
