import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  getPureDate,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { BookingStatus, AttendanceStatus } from '@/booking/@types/booking';

export interface IBookingQueryParams extends ICursorPaginateParams {
  userId?: string;
  providerId?: string;
  activityTypeId?: string;
  bookingDate?: Date;
  status?: BookingStatus;
  attendanceStatus?: AttendanceStatus;
}

const generateFilter = async (
  params: IBookingQueryParams,
  clientPortal?: any,
  cpUser?: any,
) => {
  const filter: any = {};

  // If clientPortal exists, filter by cpUser
  if (clientPortal && cpUser) {
    filter.userId = cpUser.erxesCustomerId || cpUser._id;
  } else if (params.userId) {
    filter.userId = params.userId;
  }

  if (params.providerId) {
    filter.providerId = params.providerId;
  }

  if (params.activityTypeId) {
    filter.activityTypeId = params.activityTypeId;
  }

  if (params.bookingDate) {
    const dateStart = getPureDate(params.bookingDate);
    const dateEnd = new Date(dateStart);
    dateEnd.setHours(23, 59, 59, 999);
    filter.bookingDate = { $gte: dateStart, $lte: dateEnd };
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (params.attendanceStatus) {
    filter.attendanceStatus = params.attendanceStatus;
  }

  return filter;
};

export const bookingQueries: Record<string, Resolver> = {
  async oneFitBookings(
    _root: undefined,
    params: IBookingQueryParams,
    { models, clientPortal, cpUser }: IContext,
  ) {
    const filter = await generateFilter(params, clientPortal, cpUser);

    // Order by createdAt only (newest first)
    return await cursorPaginate({
      model: models.Booking,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });
  },

  async oneFitBookingsCount(
    _root: undefined,
    params: IBookingQueryParams,
    { models, clientPortal, cpUser }: IContext,
  ) {
    const filter = await generateFilter(params, clientPortal, cpUser);
    return models.Booking.find(filter).countDocuments();
  },

  async oneFitBooking(
    _root: undefined,
    { _id }: { _id: string },
    { models, clientPortal, cpUser }: IContext,
  ) {
    const query: any = { _id };

    // If clientPortal exists, filter by cpUser
    if (clientPortal && cpUser) {
      query.userId = cpUser.erxesCustomerId || cpUser._id;
    }

    return models.Booking.findOne(query);
  },

  async oneFitBookingByBookingId(
    _root: undefined,
    { bookingId }: { bookingId: string },
    { models, clientPortal, cpUser }: IContext,
  ) {
    const query: any = { bookingId };

    // If clientPortal exists, filter by cpUser
    if (clientPortal && cpUser) {
      query.userId = cpUser.erxesCustomerId || cpUser._id;
    }

    return models.Booking.findOne(query);
  },

  async cpOneFitBookings(
    _root: undefined,
    params: Omit<IBookingQueryParams, 'userId'>,
    { models, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const filter = await generateFilter({ ...params, userId }, true, cpUser);

    return await cursorPaginate({
      model: models.Booking,
      params: {
        ...params,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });
  },

  async cpOneFitBookingsCount(
    _root: undefined,
    params: Omit<IBookingQueryParams, 'userId'>,
    { models, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const filter = await generateFilter({ ...params, userId }, true, cpUser);
    return models.Booking.find(filter).countDocuments();
  },

  async cpOneFitBooking(
    _root: undefined,
    { _id }: { _id: string },
    { models, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const booking = await models.Booking.findOne({ _id });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('You do not have permission to access this booking');
    }

    return booking;
  },

  async cpOneFitBookingByBookingId(
    _root: undefined,
    { bookingId }: { bookingId: string },
    { models, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const booking = await models.Booking.findOne({ bookingId });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('You do not have permission to access this booking');
    }

    return booking;
  },
};

bookingQueries.cpOneFitBookings.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

bookingQueries.cpOneFitBookingsCount.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

bookingQueries.cpOneFitBooking.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

bookingQueries.cpOneFitBookingByBookingId.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};
