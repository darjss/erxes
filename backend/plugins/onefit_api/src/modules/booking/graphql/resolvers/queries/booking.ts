import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  getPureDate,
  markResolvers,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { BookingStatus, AttendanceStatus } from '@/booking/@types/booking';
import { addInstanceIdFilter } from '~/utils/providerFilter';
import { accountStatementQueries } from '@/booking/graphql/resolvers/queries/accountStatement';

export interface IBookingQueryParams extends ICursorPaginateParams {
  userId?: string;
  providerId?: string;
  activityTypeId?: string;
  bookingDate?: Date;
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus;
  attendanceStatus?: AttendanceStatus;
}

const generateFilter = async (
  params: IBookingQueryParams,
  context: IContext,
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

  if (params.startDate != null || params.endDate != null) {
    if (params.startDate != null) {
      filter.bookingDate = filter.bookingDate || {};
      filter.bookingDate.$gte = getPureDate(params.startDate);
    }
    if (params.endDate != null) {
      const endDateEod = new Date(getPureDate(params.endDate));
      endDateEod.setHours(23, 59, 59, 999);
      filter.bookingDate = filter.bookingDate || {};
      filter.bookingDate.$lte = endDateEod;
    }
  } else if (params.bookingDate) {
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

  // Add instanceId filtering
  return await addInstanceIdFilter(context, filter);
};

export const bookingQueries: Record<string, Resolver> = {
  ...accountStatementQueries,
  async oneFitBookings(
    _root: undefined,
    params: IBookingQueryParams,
    context: IContext,
  ) {
    const { models, clientPortal, cpUser } = context;
    const filter = await generateFilter(params, context, clientPortal, cpUser);

    const orderBy: IBookingQueryParams['orderBy'] =
      params.orderBy && Object.keys(params.orderBy).length > 0
        ? params.orderBy
        : { bookingDate: 'desc' };

    return await cursorPaginate({
      model: models.Booking,
      params: {
        ...params,
        orderBy,
      },
      query: filter,
    });
  },

  async oneFitBookingsCount(
    _root: undefined,
    params: IBookingQueryParams,
    context: IContext,
  ) {
    const { models, clientPortal, cpUser } = context;
    const filter = await generateFilter(params, context, clientPortal, cpUser);
    return models.Booking.find(filter).countDocuments();
  },

  async oneFitBooking(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, clientPortal, cpUser } = context;
    const query: any = { _id };

    // If clientPortal exists, filter by cpUser
    if (clientPortal && cpUser) {
      query.userId = cpUser.erxesCustomerId || cpUser._id;
    }

    const booking = await models.Booking.findOne(query);

    // Verify instanceId ownership if instanceId is set
    if (booking && context.instanceId) {
      const provider = await models.Provider.findOne({
        _id: booking.providerId,
      });
      if (provider && provider.instanceId !== context.instanceId) {
        return null;
      }
    }

    return booking;
  },

  async oneFitBookingByBookingId(
    _root: undefined,
    { bookingId }: { bookingId: string },
    context: IContext,
  ) {
    const { models, clientPortal, cpUser } = context;
    const query: any = { _id: bookingId };

    // If clientPortal exists, filter by cpUser
    if (clientPortal && cpUser) {
      query.userId = cpUser.erxesCustomerId || cpUser._id;
    }

    const booking = await models.Booking.findOne(query);

    // Verify instanceId ownership if instanceId is set
    if (booking && context.instanceId) {
      const provider = await models.Provider.findOne({
        _id: booking.providerId,
      });
      if (provider && provider.instanceId !== context.instanceId) {
        return null;
      }
    }
    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  },

  async cpOneFitBookings(
    _root: undefined,
    params: Omit<IBookingQueryParams, 'userId'>,
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const filter = await generateFilter(
      { ...params, userId },
      context,
      true,
      cpUser,
    );

    const orderBy: IBookingQueryParams['orderBy'] =
      params.orderBy && Object.keys(params.orderBy).length > 0
        ? params.orderBy
        : { createdAt: 'desc' };

    return await cursorPaginate({
      model: models.Booking,
      params: {
        ...params,
        orderBy,
      },
      query: filter,
    });
  },

  async cpOneFitBookingsCount(
    _root: undefined,
    params: Omit<IBookingQueryParams, 'userId'>,
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const filter = await generateFilter(
      { ...params, userId },
      context,
      true,
      cpUser,
    );
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
    const booking = await models.Booking.findOne({ _id: bookingId });

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
