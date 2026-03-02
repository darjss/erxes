import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  getPureDate,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  generateTemplateFilter,
  generateExceptionFilter,
} from '../utils/filters';
import { DayOfWeek } from '@/schedule/@types/schedule';
import { BookingStatus } from '@/booking/@types/booking';
import { IModels } from '~/connectionResolvers';

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

function getDayOfWeek(date: Date): DayOfWeek {
  const days = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];
  return days[date.getDay()];
}

export const scheduleQueries = {
  async oneFitScheduleTemplates(
    _root: undefined,
    params: IScheduleTemplateQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateTemplateFilter(params, context);

    return await cursorPaginate({
      model: models.ScheduleTemplate,
      params,
      query: filter,
    });
  },

  async oneFitScheduleTemplatesCount(
    _root: undefined,
    params: IScheduleTemplateQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateTemplateFilter(params, context);
    return models.ScheduleTemplate.find(filter).countDocuments();
  },

  async oneFitScheduleTemplate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;
    const scheduleTemplate = await models.ScheduleTemplate.findOne({ _id });

    // Verify instanceId ownership if instanceId is set
    if (scheduleTemplate && context.instanceId) {
      const provider = await models.Provider.findOne({
        _id: scheduleTemplate.providerId,
      });
      if (provider && provider.instanceId !== context.instanceId) {
        return null;
      }
    }

    return scheduleTemplate;
  },

  async oneFitScheduleTemplateByProviderAndMonth(
    _root: undefined,
    {
      providerId,
      year,
      month,
    }: { providerId: string; year: number; month: number },
    context: IContext,
  ) {
    const { models } = context;

    // Verify instanceId ownership if instanceId is set
    if (context.instanceId) {
      const provider = await models.Provider.findOne({ _id: providerId });
      if (!provider || provider.instanceId !== context.instanceId) {
        return null;
      }
    }

    return models.ScheduleTemplate.findByProviderAndMonth(
      providerId,
      year,
      month,
    );
  },

  async oneFitScheduleExceptions(
    _root: undefined,
    params: IScheduleExceptionQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateExceptionFilter(params, context);
    return await cursorPaginate({
      model: models.ScheduleException,
      params,
      query: filter,
    });
  },

  async oneFitScheduleExceptionsCount(
    _root: undefined,
    params: IScheduleExceptionQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateExceptionFilter(params, context);
    return models.ScheduleException.find(filter).countDocuments();
  },

  async oneFitScheduleException(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;
    const scheduleException = await models.ScheduleException.findOne({ _id });

    // Verify instanceId ownership if instanceId is set
    if (scheduleException && context.instanceId) {
      const provider = await models.Provider.findOne({
        _id: scheduleException.providerId,
      });
      if (provider && provider.instanceId !== context.instanceId) {
        return null;
      }
    }

    return scheduleException;
  },

  async oneFitMonthAvailability(
    _root: undefined,
    {
      providerId,
      activityTypeId,
      year,
      month,
      lastDays,
    }: {
      providerId: string;
      activityTypeId: string;
      year: number;
      month: number;
      lastDays?: number;
    },
    context: IContext,
  ) {
    const { models } = context;

    // Verify instanceId ownership if instanceId is set
    if (context.instanceId) {
      const provider = await models.Provider.findOne({ _id: providerId });
      if (!provider || provider.instanceId !== context.instanceId) {
        return {
          year,
          month,
          days: [],
        };
      }
    }
    // Get schedule template for the month/year
    const scheduleTemplate =
      await models.ScheduleTemplate.findByProviderAndMonth(
        providerId,
        year,
        month,
      );
    // Get all days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const days: Array<{
      date: Date;
      isFull: boolean;
      seatsLeft: number;
      totalSeats: number;
      bookedSeats: number;
      hasSchedule: boolean;
      isBlockedByException: boolean;
      schedule?: {
        dayOfWeek: DayOfWeek;
        activityTypeId: string;
        genderRestriction: string;
        startTime: string;
        endTime: string;
        dailyLimit: number;
      };
    }> = [];

    // Get all exceptions for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const exceptions = await models.ScheduleException.find({
      providerId,
      date: { $gte: startDate, $lte: endDate },
      $or: [
        { activityTypeId: activityTypeId },
        { activityTypeId: { $exists: false } },
      ],
    });
    const exceptionDates = new Set(
      exceptions.map((ex) => getPureDate(ex.date).getTime()),
    );

    // Get all bookings for this month (excluding cancelled)
    const bookings = await models.Booking.find({
      providerId,
      activityTypeId,
      bookingDate: { $gte: startDate, $lte: endDate },
      status: { $ne: BookingStatus.CANCELLED },
    });

    // Group bookings by date
    const bookingsByDate = new Map<number, number>();
    for (const booking of bookings) {
      const bookingDate = new Date(booking.bookingDate);
      const dateKey = bookingDate.getTime();
      bookingsByDate.set(dateKey, (bookingsByDate.get(dateKey) || 0) + 1);
    }
    // Process each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateKey = currentDate.getTime();
      const isBlocked = exceptionDates.has(dateKey);

      // Check if there's an exception for this date
      if (isBlocked) {
        // Find the daily schedule to get totalSeats
        const dayOfWeek = getDayOfWeek(currentDate);
        const dailySchedule = scheduleTemplate?.dailySchedules.find(
          (schedule) =>
            schedule.dayOfWeek === dayOfWeek &&
            schedule.activityTypeId === activityTypeId,
        );

        days.push({
          date: currentDate,
          isFull: true,
          seatsLeft: 0,
          totalSeats: dailySchedule?.dailyLimit || 0,
          bookedSeats: 0,
          hasSchedule: !!scheduleTemplate && !!dailySchedule,
          isBlockedByException: true,
          schedule: dailySchedule
            ? {
                dayOfWeek,
                activityTypeId,
                genderRestriction: dailySchedule.genderRestriction,
                startTime: dailySchedule.startTime,
                endTime: dailySchedule.endTime,
                dailyLimit: dailySchedule.dailyLimit,
              }
            : undefined,
        } as (typeof days)[number]);
        continue;
      }

      // Check if schedule template exists
      if (!scheduleTemplate) {
        days.push({
          date: currentDate,
          isFull: true,
          seatsLeft: 0,
          totalSeats: 0,
          bookedSeats: 0,
          hasSchedule: false,
          isBlockedByException: false,
        } as (typeof days)[number]);
        continue;
      }

      // Get day of week for the current date
      const dayOfWeek = getDayOfWeek(currentDate);

      // Find matching daily schedule
      const dailySchedule = scheduleTemplate.dailySchedules.find(
        (schedule) =>
          schedule.dayOfWeek === dayOfWeek &&
          schedule.activityTypeId === activityTypeId,
      );

      if (!dailySchedule) {
        days.push({
          date: currentDate,
          isFull: true,
          seatsLeft: 0,
          totalSeats: 0,
          bookedSeats: 0,
          hasSchedule: false,
          isBlockedByException: false,
        } as (typeof days)[number]);
        continue;
      }

      // Count existing bookings for this date
      const bookedSeats = bookingsByDate.get(dateKey) || 0;
      const totalSeats = dailySchedule.dailyLimit;
      const seatsLeft = Math.max(0, totalSeats - bookedSeats);
      const isFull = seatsLeft <= 0;

      days.push({
        date: currentDate,
        isFull,
        seatsLeft,
        totalSeats,
        bookedSeats,
        hasSchedule: true,
        isBlockedByException: false,
        schedule: {
          dayOfWeek,
          activityTypeId,
          genderRestriction: dailySchedule.genderRestriction,
          startTime: dailySchedule.startTime,
          endTime: dailySchedule.endTime,
          dailyLimit: dailySchedule.dailyLimit,
        },
      } as (typeof days)[number]);
    }

    // If lastDays is provided, return only days between currentDate and currentDate + lastDays
    let resultDays = days;

    if (lastDays && lastDays > 0) {
      const now = new Date();
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + lastDays);

      resultDays = days.filter(
        (dayInfo) => dayInfo.date >= startDate && dayInfo.date <= endDate,
      );
    }

    return {
      year,
      month,
      days: resultDays,
    };
  },

  async oneFitScheduleCoverageSummary(
    _root: undefined,
    params: {
      providerId?: string;
      activityTypeId?: string;
      year: number;
      month: number;
    },
    context: IContext,
  ) {
    const { models, instanceId } = context;
    const { providerId, activityTypeId, year, month } = params;

    const providerFilter: any = {};

    if (instanceId) {
      providerFilter.instanceId = instanceId;
    }

    if (providerId) {
      providerFilter._id = providerId;
    }

    const providers = await models.Provider.find(providerFilter).lean();

    if (providers.length === 0) {
      return [];
    }

    const providerIds = providers.map((p) => p._id.toString());

    const providersById = new Map<string, (typeof providers)[number]>();
    for (const provider of providers) {
      providersById.set(provider._id.toString(), provider);
    }

    const templateFilter = await generateTemplateFilter(
      {
        providerId,
        year,
        month,
        activityTypeId,
      },
      context,
    );

    const templates = await models.ScheduleTemplate.find(templateFilter);

    const activityTypesFilter: any = {};

    if (providerId) {
      activityTypesFilter.providerId = providerId;
    } else {
      activityTypesFilter.providerId = { $in: providerIds };
    }

    if (activityTypeId) {
      activityTypesFilter._id = activityTypeId;
    }

    const activityTypes = await models.ActivityType.find(
      activityTypesFilter,
    ).lean();

    const activityTypesById = new Map<string, (typeof activityTypes)[number]>();
    for (const at of activityTypes) {
      activityTypesById.set(at._id.toString(), at);
    }

    const daysInMonth = new Date(year, month, 0).getDate();

    const rows: Array<{
      providerId: string;
      provider: any;
      providerIsActive: boolean;
      providerStatus: string | null;
      templateId: string | null;
      activityTypeId?: string;
      activityType?: any;
      year: number;
      month: number;
      hasTemplate: boolean;
      hasAnySchedule: boolean;
      missingDaysCount: number;
    }> = [];

    for (const pid of providerIds) {
      const providerTemplates = templates.filter((t) => t.providerId === pid);
      const provider = providersById.get(pid) || null;
      const providerIsActive = Boolean(provider?.isActive);
      const providerStatus = (provider?.status as string | undefined) ?? null;
      const providerTemplate = providerTemplates[0];
      const providerActivityTypes = activityTypes.filter(
        (at) => at.providerId?.toString() === pid,
      );

      const hasTemplate = providerTemplates.length > 0;
      const hasAnyScheduleOverall = providerTemplates.some(
        (t) => (t.dailySchedules?.length ?? 0) > 0,
      );

      if (!activityTypeId) {
        rows.push({
          providerId: pid,
          provider,
          providerIsActive,
          providerStatus,
          templateId: providerTemplate?._id?.toString() ?? null,
          activityTypeId: undefined,
          activityType: undefined,
          year,
          month,
          hasTemplate,
          hasAnySchedule: hasAnyScheduleOverall,
          missingDaysCount: hasAnyScheduleOverall ? 0 : daysInMonth,
        });
      }

      for (const at of providerActivityTypes) {
        const dailySchedules =
          providerTemplate?.dailySchedules?.filter(
            (s) => s.activityTypeId === at._id.toString(),
          ) ?? [];

        const hasTemplateForActivity = Boolean(providerTemplate);
        const hasAnyScheduleForActivity = dailySchedules.length > 0;

        const hasScheduleForDayOfWeek = new Set<DayOfWeek>();
        for (const s of dailySchedules) {
          hasScheduleForDayOfWeek.add(s.dayOfWeek as DayOfWeek);
        }

        let missingDaysCount = 0;
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month - 1, day);
          const dayOfWeek = getDayOfWeek(currentDate);
          if (!hasScheduleForDayOfWeek.has(dayOfWeek)) {
            missingDaysCount += 1;
          }
        }

        rows.push({
          providerId: pid,
          provider,
          providerIsActive,
          providerStatus,
          templateId: providerTemplate?._id?.toString() ?? null,
          activityTypeId: at._id.toString(),
          activityType: activityTypesById.get(at._id.toString()) || null,
          year,
          month,
          hasTemplate: hasTemplateForActivity,
          hasAnySchedule: hasAnyScheduleForActivity,
          missingDaysCount,
        });
      }
    }

    return rows;
  },
};
markResolvers(scheduleQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
