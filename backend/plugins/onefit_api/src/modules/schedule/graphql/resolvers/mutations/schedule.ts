import { IContext } from '~/connectionResolvers';
import {
  IScheduleTemplate,
  IScheduleException,
  IScheduleTemplateDocument,
} from '@/schedule/@types/schedule';
import { requirePermission } from '~/utils/onefitPermissionCheck';

export const scheduleMutations = {
  async oneFitScheduleTemplateCreate(
    _root: undefined,
    doc: IScheduleTemplate,
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
    return await models.ScheduleTemplate.createTemplate({ ...doc });
  },

  async oneFitScheduleTemplateUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IScheduleTemplate>,
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
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
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
    const outcomes = await Promise.all(
      providerIds.map(async (providerId) => {
        const template = await models.ScheduleTemplate.copyPreviousMonth(
          providerId,
          fromYear,
          fromMonth,
          toYear,
          toMonth,
        );
        return { providerId, template };
      }),
    );

    const templates: IScheduleTemplateDocument[] = [];
    const skippedProviderIds: string[] = [];

    for (const { providerId, template } of outcomes) {
      if (template) {
        templates.push(template);
      } else {
        skippedProviderIds.push(providerId);
      }
    }

    return { templates, skippedProviderIds };
  },

  async oneFitScheduleTemplatesRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
    return await models.ScheduleTemplate.removeTemplates(ids);
  },

  async oneFitScheduleExceptionCreate(
    _root: undefined,
    doc: IScheduleException,
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
    return await models.ScheduleException.createException({ ...doc });
  },

  async oneFitScheduleExceptionRemove(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
    return await models.ScheduleException.removeException(_id);
  },

  async oneFitScheduleExceptionsRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    await requirePermission(context, 'scheduleManage');
    const { models } = context;
    return await models.ScheduleException.removeExceptions(ids);
  },
};
