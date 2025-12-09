import { IContext } from '~/connectionResolvers';
import {
  IScheduleTemplate,
  IScheduleException,
} from '@/schedule/@types/schedule';

export const scheduleMutations = {
  async oneFitScheduleTemplateCreate(
    _root: undefined,
    doc: IScheduleTemplate,
    { models }: IContext,
  ) {
    return await models.ScheduleTemplate.createTemplate({ ...doc });
  },

  async oneFitScheduleTemplateUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IScheduleTemplate>,
    { models }: IContext,
  ) {
    return await models.ScheduleTemplate.updateTemplate(_id, doc);
  },

  async oneFitScheduleTemplateCopyPreviousMonth(
    _root: undefined,
    {
      providerIds,
      fromYear,
      fromMonth,
      toYear,
      toMonth,
    }: {
      providerIds: string[];
      fromYear: number;
      fromMonth: number;
      toYear: number;
      toMonth: number;
    },
    { models }: IContext,
  ) {
    const results = await Promise.all(
      providerIds.map((providerId) =>
        models.ScheduleTemplate.copyPreviousMonth(
          providerId,
          fromYear,
          fromMonth,
          toYear,
          toMonth,
        ),
      ),
    );
    return results;
  },

  async oneFitScheduleTemplatesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.ScheduleTemplate.removeTemplates(ids);
  },

  async oneFitScheduleExceptionCreate(
    _root: undefined,
    doc: IScheduleException,
    { models }: IContext,
  ) {
    return await models.ScheduleException.createException({ ...doc });
  },

  async oneFitScheduleExceptionRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.ScheduleException.removeException(_id);
  },

  async oneFitScheduleExceptionsRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.ScheduleException.removeExceptions(ids);
  },
};
