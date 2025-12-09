import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, getPureDate } from 'erxes-api-shared/utils';
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

const generateFilter = async (params: IBookingQueryParams) => {
  const filter: any = {};

  if (params.userId) {
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

export const bookingQueries = {
  async oneFitBookings(
    _root: undefined,
    params: IBookingQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);

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
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.Booking.find(filter).countDocuments();
  },

  async oneFitBooking(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Booking.findOne({ _id });
  },

  async oneFitBookingByBookingId(
    _root: undefined,
    { bookingId }: { bookingId: string },
    { models }: IContext,
  ) {
    return models.Booking.findOne({ bookingId });
  },
};
