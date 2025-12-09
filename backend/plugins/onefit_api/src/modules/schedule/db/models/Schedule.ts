import {
  IScheduleTemplate,
  IScheduleTemplateDocument,
  IScheduleException,
  IScheduleExceptionDocument,
} from '@/schedule/@types/schedule';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {
  scheduleTemplateSchema,
  scheduleExceptionSchema,
} from '../definitions/schedule';

export interface IScheduleTemplateModel
  extends Model<IScheduleTemplateDocument> {
  createTemplate(doc: IScheduleTemplate): Promise<IScheduleTemplateDocument>;
  updateTemplate(
    _id: string,
    doc: Partial<IScheduleTemplate>,
  ): Promise<IScheduleTemplateDocument>;
  findByProviderAndMonth(
    providerId: string,
    year: number,
    month: number,
  ): Promise<IScheduleTemplateDocument | null>;
  copyPreviousMonth(
    providerId: string,
    fromYear: number,
    fromMonth: number,
    toYear: number,
    toMonth: number,
  ): Promise<IScheduleTemplateDocument>;
  removeTemplates(ids: string[]): Promise<{ n: number; ok: number }>;
}

export interface IScheduleExceptionModel
  extends Model<IScheduleExceptionDocument> {
  createException(doc: IScheduleException): Promise<IScheduleExceptionDocument>;
  removeException(_id: string): Promise<{ ok: number }>;
  findByProviderAndDate(
    providerId: string,
    date: Date,
  ): Promise<IScheduleExceptionDocument | null>;
  findByProviderAndDateRange(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IScheduleExceptionDocument[]>;
  removeExceptions(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadScheduleTemplateClass = (models: IModels) => {
  class ScheduleTemplate {
    public static async createTemplate(doc: IScheduleTemplate) {
      return await models.ScheduleTemplate.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async updateTemplate(
      _id: string,
      doc: Partial<IScheduleTemplate>,
    ) {
      return await models.ScheduleTemplate.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...doc,
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async findByProviderAndMonth(
      providerId: string,
      year: number,
      month: number,
    ) {
      return await models.ScheduleTemplate.findOne({
        providerId,
        year,
        month,
      });
    }

    public static async copyPreviousMonth(
      providerId: string,
      fromYear: number,
      fromMonth: number,
      toYear: number,
      toMonth: number,
    ) {
      const sourceTemplate = await models.ScheduleTemplate.findByProviderAndMonth(
        providerId,
        fromYear,
        fromMonth,
      );

      if (!sourceTemplate) {
        throw new Error('Source template not found');
      }

      return await models.ScheduleTemplate.createTemplate({
        providerId,
        year: toYear,
        month: toMonth,
        dailySchedules: sourceTemplate.dailySchedules,
      });
    }

    public static async removeTemplates(ids: string[]) {
      return models.ScheduleTemplate.deleteMany({ _id: { $in: ids } });
    }
  }

  scheduleTemplateSchema.loadClass(ScheduleTemplate);

  return scheduleTemplateSchema;
};

export const loadScheduleExceptionClass = (models: IModels) => {
  class ScheduleException {
    public static async createException(doc: IScheduleException) {
      return await models.ScheduleException.create({
        ...doc,
        createdAt: new Date(),
      });
    }

    public static async removeException(_id: string) {
      return models.ScheduleException.deleteOne({ _id });
    }

    public static async findByProviderAndDate(
      providerId: string,
      date: Date,
    ) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      return await models.ScheduleException.findOne({
        providerId,
        date: { $gte: dateStart, $lte: dateEnd },
      });
    }

    public static async findByProviderAndDateRange(
      providerId: string,
      startDate: Date,
      endDate: Date,
    ) {
      return await models.ScheduleException.find({
        providerId,
        date: { $gte: startDate, $lte: endDate },
      });
    }

    public static async removeExceptions(ids: string[]) {
      return models.ScheduleException.deleteMany({ _id: { $in: ids } });
    }
  }

  scheduleExceptionSchema.loadClass(ScheduleException);

  return scheduleExceptionSchema;
};

