import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  getPureDate,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { GenderRestriction } from '@/activity-type/@types/activityType';
import { DayOfWeek } from '@/schedule/@types/schedule';
import { BookingStatus } from '@/booking/@types/booking';
import { addInstanceIdFilter } from '~/utils/providerFilter';

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

async function getActivityTypeAvailability(
  activityTypeId: string,
  providerId: string,
  date: Date,
  { models }: IContext,
) {
  const datePure = getPureDate(date);
  const year = datePure.getFullYear();
  const month = datePure.getMonth() + 1;

  // Get schedule template for the month/year
  const scheduleTemplate = await models.ScheduleTemplate.findByProviderAndMonth(
    providerId,
    year,
    month,
  );

  if (!scheduleTemplate) {
    return {
      date: datePure,
      isFull: true,
      seatsLeft: 0,
      totalSeats: 0,
      bookedSeats: 0,
      hasSchedule: false,
    };
  }

  // Get day of week for the date
  const dayOfWeek = getDayOfWeek(datePure);

  // Find matching daily schedule
  const dailySchedule = scheduleTemplate.dailySchedules.find(
    (schedule) =>
      schedule.dayOfWeek === dayOfWeek &&
      schedule.activityTypeId === activityTypeId,
  );

  if (!dailySchedule) {
    return {
      date: datePure,
      isFull: true,
      seatsLeft: 0,
      totalSeats: 0,
      bookedSeats: 0,
      hasSchedule: false,
    };
  }

  // Check for schedule exceptions
  const exception = await models.ScheduleException.findOne({
    providerId,
    date: datePure,
    $or: [
      { activityTypeId: activityTypeId },
      { activityTypeId: { $exists: false } },
    ],
  });

  if (exception) {
    return {
      date: datePure,
      isFull: true,
      seatsLeft: 0,
      totalSeats: dailySchedule.dailyLimit,
      bookedSeats: 0,
      hasSchedule: true,
    };
  }

  // Count existing bookings (excluding cancelled)
  const bookedSeats = await models.Booking.countDocuments({
    providerId,
    activityTypeId,
    bookingDate: datePure,
    status: { $ne: BookingStatus.CANCELLED },
  });

  const totalSeats = dailySchedule.dailyLimit;
  const seatsLeft = Math.max(0, totalSeats - bookedSeats);
  const isFull = seatsLeft <= 0;

  return {
    date: datePure,
    isFull,
    seatsLeft,
    totalSeats,
    bookedSeats,
    hasSchedule: true,
  };
}

export interface IActivityTypeQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  providerId?: string;
  categoryId?: string;
  genderRestriction?: GenderRestriction;
  isActive?: boolean;
}

const generateFilter = async (
  params: IActivityTypeQueryParams,
  context?: IContext,
) => {
  const filter: any = {};

  if (params.searchValue) {
    const searchRegex = {
      $regex: `.*${escapeRegExp(params.searchValue)}.*`,
      $options: 'i',
    };
    filter.$or = [
      { 'name.en': searchRegex },
      { 'name.mn': searchRegex },
      { 'description.en': searchRegex },
      { 'description.mn': searchRegex },
    ];
  }

  if (params.providerId) {
    filter.providerId = params.providerId;
  }

  if (params.categoryId) {
    filter.categoryIds = params.categoryId;
  }

  if (params.genderRestriction) {
    filter.genderRestriction = params.genderRestriction;
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  // Add instanceId filtering if context is provided
  if (context) {
    return await addInstanceIdFilter(context, filter);
  }

  return filter;
};

export const activityTypeQueries = {
  async oneFitActivityTypes(
    _root: undefined,
    params: IActivityTypeQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateFilter(params, context);

    return await cursorPaginate({
      model: models.ActivityType,
      params,
      query: filter,
    });
  },

  async oneFitActivityTypesCount(
    _root: undefined,
    params: IActivityTypeQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateFilter(params, context);
    return models.ActivityType.find(filter).countDocuments();
  },

  async oneFitActivityType(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models } = context;
    const activityType = await models.ActivityType.findOne({ _id });

    // Verify instanceId ownership if instanceId is set
    if (activityType && context.instanceId) {
      const provider = await models.Provider.findOne({
        _id: activityType.providerId,
      });
      if (provider && provider.instanceId !== context.instanceId) {
        return null;
      }
    }

    return activityType;
  },

  async oneFitActivityTypesWithAvailability(
    _root: undefined,
    params: IActivityTypeQueryParams & {
      date: Date;
      categoryIds?: string[];
      hasSchedule?: boolean;
      isFull?: boolean;
    },
    context: IContext,
  ) {
    let baseFilter: any = {};

    // Filter by categories
    if (params.categoryIds && params.categoryIds.length > 0) {
      baseFilter.categoryIds = { $in: params.categoryIds };
    } else if (params.categoryId) {
      baseFilter.categoryIds = params.categoryId;
    }

    // Filter by provider
    if (params.providerId) {
      baseFilter.providerId = params.providerId;
    }

    // Filter by active status
    if (params.isActive !== undefined) {
      baseFilter.isActive = params.isActive;
    }

    // Add instanceId filtering
    baseFilter = await addInstanceIdFilter(context, baseFilter);

    // Get all activity types matching base filters (only _id and providerId for efficiency)
    const allActivityTypes = await context.models.ActivityType.find(
      baseFilter,
      { _id: 1, providerId: 1 },
    ).lean();

    if (allActivityTypes.length === 0) {
      return {
        list: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    // Calculate availability for all activity types
    const availabilityResults = await Promise.all(
      allActivityTypes.map(async (activityType) => {
        const availability = await getActivityTypeAvailability(
          activityType._id,
          activityType.providerId,
          params.date,
          context,
        );
        return {
          _id: activityType._id,
          availability,
        };
      }),
    );

    // Filter by hasSchedule and isFull
    let filteredIds = availabilityResults;

    if (params.hasSchedule !== undefined) {
      filteredIds = filteredIds.filter(
        (item) => item.availability.hasSchedule === params.hasSchedule,
      );
    }

    if (params.isFull !== undefined) {
      filteredIds = filteredIds.filter(
        (item) => item.availability.isFull === params.isFull,
      );
    }

    // If no activity types match the availability filters, return empty
    if (filteredIds.length === 0) {
      return {
        list: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    // Create map of availability by activity type ID
    const availabilityMap = new Map(
      filteredIds.map((item) => [String(item._id), item.availability]),
    );

    // Final filter with activity type IDs that passed availability filters
    const finalFilter = {
      ...baseFilter,
      _id: { $in: filteredIds.map((item) => item._id) },
    };

    // cursorPaginate as the last action
    const paginatedResult = await cursorPaginate({
      model: context.models.ActivityType,
      params,
      query: finalFilter,
    });

    // Attach availability to each paginated result
    const list = paginatedResult.list.map((activityType) => ({
      ...activityType,
      availability: availabilityMap.get(String(activityType._id)),
    }));

    return {
      list,
      totalCount: paginatedResult.totalCount,
      pageInfo: paginatedResult.pageInfo,
    };
  },
};

markResolvers(activityTypeQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
