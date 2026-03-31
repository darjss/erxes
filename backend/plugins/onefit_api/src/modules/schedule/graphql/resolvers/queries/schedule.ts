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
import { BookingStatus, IBooking } from '@/booking/@types/booking';
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

type MonthAvailabilityDay = {
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
};

function enumerateCalendarMonthsOverlappingRange(
  rangeStart: Date,
  rangeEnd: Date,
): Array<{ year: number; month: number }> {
  const months: Array<{ year: number; month: number }> = [];
  const cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

  while (cursor <= endMonth) {
    months.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth() + 1,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
}

async function buildMonthAvailabilityDaysForCalendarMonth(
  models: IModels,
  providerId: string,
  activityTypeId: string,
  year: number,
  month: number,
): Promise<MonthAvailabilityDay[]> {
  const scheduleTemplate = await models.ScheduleTemplate.findByProviderAndMonth(
    providerId,
    year,
    month,
  );

  const daysInMonth = new Date(year, month, 0).getDate();
  const days: MonthAvailabilityDay[] = [];

  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
  const exceptions = await models.ScheduleException.find({
    providerId,
    date: { $gte: monthStart, $lte: monthEnd },
    $or: [
      { activityTypeId: activityTypeId },
      { activityTypeId: { $exists: false } },
    ],
  });
  const exceptionDates = new Set(
    exceptions.map((ex) => getPureDate(ex.date).getTime()),
  );

  const bookings = await models.Booking.find({
    providerId,
    activityTypeId,
    bookingDate: { $gte: monthStart, $lte: monthEnd },
    status: { $ne: BookingStatus.CANCELLED },
  });

  const bookingsByDateAndTime = new Map<string, number>();
  for (const booking of bookings as IBooking[]) {
    const bookingDate = new Date(booking.bookingDate);
    const dateKey = bookingDate.getTime();
    const startTime = booking.startTime ?? '';
    const key = `${dateKey}-${startTime}`;
    bookingsByDateAndTime.set(key, (bookingsByDateAndTime.get(key) || 0) + 1);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    const dateKey = currentDate.getTime();
    const isBlocked = exceptionDates.has(dateKey);

    if (isBlocked) {
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
      });
      continue;
    }

    if (!scheduleTemplate) {
      days.push({
        date: currentDate,
        isFull: true,
        seatsLeft: 0,
        totalSeats: 0,
        bookedSeats: 0,
        hasSchedule: false,
        isBlockedByException: false,
      });
      continue;
    }

    const dayOfWeek = getDayOfWeek(currentDate);

    const dailySchedules = scheduleTemplate.dailySchedules.filter(
      (schedule) =>
        schedule.dayOfWeek === dayOfWeek &&
        schedule.activityTypeId === activityTypeId,
    );
    if (dailySchedules.length === 0) {
      days.push({
        date: currentDate,
        isFull: true,
        seatsLeft: 0,
        totalSeats: 0,
        bookedSeats: 0,
        hasSchedule: false,
        isBlockedByException: false,
      });
      continue;
    }
    for (const dailySchedule of dailySchedules) {
      const slotKey = `${dateKey}-${dailySchedule.startTime}`;
      const bookedSeats = bookingsByDateAndTime.get(slotKey) || 0;
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
      });
    }
  }

  return days;
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

    let monthsToBuild: Array<{ year: number; month: number }> = [
      { year, month },
    ];
    let windowStart: Date | null = null;
    let windowEnd: Date | null = null;

    if (lastDays && lastDays > 0) {
      const now = new Date();
      windowStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      windowEnd = new Date(windowStart);
      windowEnd.setDate(windowEnd.getDate() + lastDays);

      monthsToBuild = enumerateCalendarMonthsOverlappingRange(
        windowStart,
        windowEnd,
      );
    }

    const mergedDays: MonthAvailabilityDay[] = [];
    for (const ym of monthsToBuild) {
      const chunk = await buildMonthAvailabilityDaysForCalendarMonth(
        models,
        providerId,
        activityTypeId,
        ym.year,
        ym.month,
      );
      mergedDays.push(...chunk);
    }

    mergedDays.sort((a, b) => a.date.getTime() - b.date.getTime());

    let resultDays = mergedDays;

    if (lastDays && lastDays > 0 && windowStart && windowEnd) {
      resultDays = mergedDays.filter(
        (dayInfo) => dayInfo.date >= windowStart && dayInfo.date <= windowEnd,
      );
    }

    return {
      year,
      month,
      days: resultDays,
    };
  },

  async oneFitDaySlots(
    _root: undefined,
    {
      providerId,
      currentDate: currentDateParam,
    }: { providerId: string; currentDate: Date },
    context: IContext,
  ) {
    const { models } = context;
    const currentDate = getPureDate(new Date(currentDateParam));
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    if (context.instanceId) {
      const provider = await models.Provider.findOne({ _id: providerId });
      if (!provider || provider.instanceId !== context.instanceId) {
        return [];
      }
    }

    const scheduleTemplate =
      await models.ScheduleTemplate.findByProviderAndMonth(
        providerId,
        year,
        month,
      );

    const dateKey = currentDate.getTime();
    const startOfDay = new Date(currentDate);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const exceptions = await models.ScheduleException.find({
      providerId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const bookings = await models.Booking.find({
      providerId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: BookingStatus.CANCELLED },
    });
    const bookingsBySlotKey = new Map<string, number>();
    for (const booking of bookings as IBooking[]) {
      const bookingDatePure = new Date(booking.bookingDate);
      const at = booking.activityTypeId ?? '';
      const key = `${bookingDatePure.getTime()}-${at}-${
        booking.startTime ?? ''
      }`;
      bookingsBySlotKey.set(key, (bookingsBySlotKey.get(key) || 0) + 1);
    }

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

    const dayOfWeek = getDayOfWeek(currentDate);

    const isDateBlockedForActivityType = (atId: string): boolean =>
      exceptions.some(
        (ex) =>
          getPureDate(ex.date).getTime() === dateKey &&
          (ex.activityTypeId == null || ex.activityTypeId === atId),
      );

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
      return days;
    }

    const dailySchedules = scheduleTemplate.dailySchedules.filter(
      (schedule) => schedule.dayOfWeek === dayOfWeek,
    );

    if (dailySchedules.length === 0) {
      days.push({
        date: currentDate,
        isFull: true,
        seatsLeft: 0,
        totalSeats: 0,
        bookedSeats: 0,
        hasSchedule: false,
        isBlockedByException: false,
      } as (typeof days)[number]);
      return days;
    }
    for (const dailySchedule of dailySchedules) {
      const atId = dailySchedule.activityTypeId;
      const isBlocked = isDateBlockedForActivityType(atId);
      if (isBlocked) {
        days.push({
          date: currentDate,
          isFull: true,
          seatsLeft: 0,
          totalSeats: dailySchedule.dailyLimit,
          bookedSeats: 0,
          hasSchedule: true,
          isBlockedByException: true,
          schedule: {
            dayOfWeek,
            activityTypeId: atId,
            genderRestriction: dailySchedule.genderRestriction,
            startTime: dailySchedule.startTime,
            endTime: dailySchedule.endTime,
            dailyLimit: dailySchedule.dailyLimit,
          },
        } as (typeof days)[number]);
        continue;
      }
      const slotKey = `${dateKey}-${atId}-${dailySchedule.startTime}`;
      const bookedSeats = bookingsBySlotKey.get(slotKey) || 0;
      const totalSeats = dailySchedule.dailyLimit;
      const seatsLeft = Math.max(0, totalSeats - bookedSeats);
      days.push({
        date: currentDate,
        isFull: seatsLeft <= 0,
        seatsLeft,
        totalSeats,
        bookedSeats,
        hasSchedule: true,
        isBlockedByException: false,
        schedule: {
          dayOfWeek,
          activityTypeId: atId,
          genderRestriction: dailySchedule.genderRestriction,
          startTime: dailySchedule.startTime,
          endTime: dailySchedule.endTime,
          dailyLimit: dailySchedule.dailyLimit,
        },
      } as (typeof days)[number]);
    }

    return days;
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

    const activityTypes =
      await models.ActivityType.find(activityTypesFilter).lean();

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
