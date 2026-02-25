import { IContext } from '~/connectionResolvers';
import {
  IBooking,
  AttendanceStatus,
  BookingStatus,
} from '@/booking/@types/booking';
import { getPureDate, sendTRPCMessage } from 'erxes-api-shared/utils';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';
import { DayOfWeek } from '@/schedule/@types/schedule';
import { Resolver } from 'erxes-api-shared/core-types';
import { getLocalizedString } from '@/activity-type/utils/localization';

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

async function createBookingLogic(
  userId: string,
  activityTypeId: string,
  bookingDate: Date,
  startTime: string,
  endTime: string,
  { models, subdomain }: IContext,
) {
  // Validate activity type exists
  const activityType = await models.ActivityType.findOne({
    _id: activityTypeId,
    isActive: true,
  });
  if (!activityType) {
    throw new Error('Activity type not found or inactive');
  }

  const providerId = activityType.providerId;
  const bookingDatePure = getPureDate(bookingDate);
  // Validate booking date is in the future
  const now = new Date();
  const bookingDateTime = new Date(bookingDatePure);
  const [hours, minutes] = startTime.split(':').map(Number);
  bookingDateTime.setHours(hours, minutes, 0, 0);

  if (bookingDateTime <= now) {
    throw new Error('Booking date must be in the future');
  }

  // Check schedule exception (blocked dates)
  const scheduleException =
    await models.ScheduleException.findByProviderAndDate(
      providerId,
      bookingDatePure,
    );
  if (scheduleException) {
    throw new Error(
      scheduleException.reason
        ? `Booking not available: ${scheduleException.reason}`
        : 'This date is blocked for bookings',
    );
  }

  // Check schedule template for the month/year
  const bookingYear = bookingDatePure.getFullYear();
  const bookingMonth = bookingDatePure.getMonth() + 1; // getMonth() returns 0-11
  const scheduleTemplate = await models.ScheduleTemplate.findByProviderAndMonth(
    providerId,
    bookingYear,
    bookingMonth,
  );

  if (!scheduleTemplate) {
    throw new Error('No schedule available for this date');
  }

  // Get day of week for the booking date
  const dayOfWeek = getDayOfWeek(bookingDatePure);

  // Find matching daily schedule
  const dailySchedule = scheduleTemplate.dailySchedules.find(
    (schedule) =>
      schedule.dayOfWeek === dayOfWeek &&
      schedule.activityTypeId === activityTypeId,
  );

  if (!dailySchedule) {
    throw new Error(
      'No matching schedule found for this activity type and time slot',
    );
  }

  // Check daily limit
  const existingBookingsCount = await models.Booking.countDocuments({
    providerId,
    activityTypeId,
    bookingDate: bookingDatePure,
    status: { $ne: BookingStatus.CANCELLED },
  });

  if (existingBookingsCount >= dailySchedule.dailyLimit) {
    throw new Error('Daily booking limit reached for this time slot');
  }

  // Check for booking conflicts (same user, same time slot)
  const existingBooking = await models.Booking.findOne({
    userId,
    bookingDate: bookingDatePure,
    startTime,
    status: { $ne: BookingStatus.CANCELLED },
  });

  if (existingBooking) {
    throw new Error('User already has a booking for this time slot');
  }

  // Check single-person limit: in any 30-day window, user cannot exceed activityType.singlePersonLimit bookings for this activity
  const singlePersonLimit = activityType.singlePersonLimit ?? 5;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const rangeStart = new Date(
    bookingDatePure.getTime() - 29 * MS_PER_DAY,
  );
  const rangeEnd = new Date(
    bookingDatePure.getTime() + 30 * MS_PER_DAY,
  );
  const existingInRange = await models.Booking.find(
    {
      userId,
      activityTypeId,
      status: { $ne: BookingStatus.CANCELLED },
      bookingDate: { $gte: rangeStart, $lt: rangeEnd },
    },
    { bookingDate: 1 },
  ).lean();

  let maxCountInAnyWindow = 0;
  for (let offset = 0; offset < 30; offset++) {
    const windowStartMs =
      bookingDatePure.getTime() - (29 - offset) * MS_PER_DAY;
    const windowEndMs = windowStartMs + 30 * MS_PER_DAY;
    const count = existingInRange.filter(
      (b) =>
        b.bookingDate.getTime() >= windowStartMs &&
        b.bookingDate.getTime() < windowEndMs,
    ).length;
    if (count > maxCountInAnyWindow) {
      maxCountInAnyWindow = count;
    }
  }
  if (maxCountInAnyWindow >= singlePersonLimit) {
    throw new Error(
      `You have reached the maximum number of bookings (${singlePersonLimit}) for this activity in a 30-day period.`,
    );
  }

  // Check membership is not on hold (booking not allowed during hold)
  const oneFitCustomerForHold = await models.OneFitCustomer.getOneFitCustomer(
    userId,
  );
  if (oneFitCustomerForHold?.isMembershipOnHold) {
    const holdEndAt = oneFitCustomerForHold.membershipHoldEndAt
      ? new Date(oneFitCustomerForHold.membershipHoldEndAt)
      : null;
    if (!holdEndAt || now <= holdEndAt) {
      throw new Error('Booking is not allowed while membership is on hold');
    }
  }

  // Check user credit balance
  const totalBalance = await models.CreditTransaction.getUserBalance(userId);
  if (totalBalance < activityType.creditCost) {
    throw new Error('Insufficient credits');
  }

  let creditSource = CreditSource.INDIVIDUAL;
  let corporateCreditId: string | undefined;

  const booking: Omit<IBooking, 'bookingId'> = {
    userId,
    providerId,
    activityTypeId,
    bookingDate: bookingDatePure,
    startTime,
    endTime,
    creditCost: activityType.creditCost,
    price: activityType.price ?? 0,
    status: BookingStatus.CONFIRMED,
    attendanceStatus: AttendanceStatus.PENDING,
  };

  const createdBooking = await models.Booking.createBooking(booking);

  // Deduct credits
  const balanceAfter = totalBalance - activityType.creditCost;
  await models.CreditTransaction.createTransaction({
    userId,
    amount: -activityType.creditCost,
    transactionType: CreditTransactionType.USAGE,
    source: creditSource,
    bookingId: createdBooking._id,
    corporateCreditId,
    description: `Booking for ${getLocalizedString(activityType.name, 'en')}`,
    balanceAfter,
  });

  // Ensure OneFitCustomer exists and update credit fields
  let oneFitCustomer;
  try {
    oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
  } catch (error) {
    oneFitCustomer = null;
  }
  if (!oneFitCustomer) {
    // Verify customer exists
    const customer = await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'customers',
      action: 'findOne',
      input: {
        query: { _id: userId },
      },
      defaultValue: null,
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Update erxes customer to have state='customer'
    await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'mutation',
      module: 'customers',
      action: 'updateCustomer',
      input: {
        _id: userId,
        doc: { state: 'customer' },
      },
    });

    // Create OneFitCustomer by updating the customer document with discriminator
    await models.OneFitCustomer.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          __t: 'OneFitCustomer',
          membershipStatus: 'none',
          currentCreditBalance: 0,
          totalCreditsEarned: 0,
          totalCreditsUsed: 0,
          totalBookings: 0,
        },
      },
      { upsert: false, new: true },
    );

    oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(userId);
  }

  // Update OneFitCustomer credit balance fields
  if (oneFitCustomer) {
    await models.OneFitCustomer.updateCreditBalanceAndUsed(
      userId,
      balanceAfter,
      activityType.creditCost,
    );
  }

  return createdBooking;
}

async function cancelBookingLogic(
  bookingId: string,
  cancelledBy: string,
  reason: string | undefined,
  { models, subdomain }: IContext,
  skipDateTimeCheck = false,
) {
  const booking = await models.Booking.findOne({ _id: bookingId });
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new Error('Booking already cancelled');
  }

  if (!skipDateTimeCheck) {
    // Check 24-hour cancellation policy
    const now = new Date();
    const bookingDateTime = new Date(booking.bookingDate);
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    const hoursUntilBooking =
      (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilBooking < 24) {
      throw new Error('Cancellation must be made at least 24 hours in advance');
    }
  }

  // Find original credit transaction for this booking
  const creditTransactions =
    await models.CreditTransaction.getTransactionsByBooking(booking._id);
  const usageTransaction = creditTransactions.find(
    (t) => t.transactionType === CreditTransactionType.USAGE,
  );

  // Refund credits if transaction exists
  if (usageTransaction) {
    const currentBalance = await models.CreditTransaction.getUserBalance(
      booking.userId,
    );
    const refundAmount = Math.abs(usageTransaction.amount);

    // Create refund transaction
    await models.CreditTransaction.createTransaction({
      userId: booking.userId,
      amount: refundAmount,
      transactionType: CreditTransactionType.REFUND,
      source: usageTransaction.source,
      bookingId: booking._id,
      corporateCreditId: usageTransaction.corporateCreditId,
      description: `Refund for cancelled booking ${booking.bookingId}`,
      balanceAfter: currentBalance + refundAmount,
    });

    // Ensure OneFitCustomer exists and update credit fields
    let oneFitCustomer;
    try {
      oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(
        booking.userId,
      );
    } catch (error) {
      oneFitCustomer = null;
    }
    if (!oneFitCustomer) {
      // Verify customer exists
      const customer = await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'query',
        module: 'customers',
        action: 'findOne',
        input: {
          query: { _id: booking.userId },
        },
        defaultValue: null,
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Update erxes customer to have state='customer'
      await sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'mutation',
        module: 'customers',
        action: 'updateCustomer',
        input: {
          _id: booking.userId,
          doc: { state: 'customer' },
        },
      });

      // Create OneFitCustomer by updating the customer document with discriminator
      await models.OneFitCustomer.findOneAndUpdate(
        { _id: booking.userId },
        {
          $set: {
            __t: 'OneFitCustomer',
            membershipStatus: 'none',
            currentCreditBalance: 0,
            totalCreditsEarned: 0,
            totalCreditsUsed: 0,
            totalBookings: 0,
          },
        },
        { upsert: false, new: true },
      );

      oneFitCustomer = await models.OneFitCustomer.getOneFitCustomer(
        booking.userId,
      );
    }

    // Update OneFitCustomer credit balance fields
    if (oneFitCustomer) {
      await models.OneFitCustomer.updateCreditBalanceForRefund(
        booking.userId,
        currentBalance + refundAmount,
        refundAmount,
      );
    }
  }

  // Cancel booking
  return await models.Booking.cancelBooking(bookingId, cancelledBy, reason);
}

export const bookingMutations: Record<string, Resolver> = {
  async oneFitBookingCreate(
    _root: undefined,
    {
      userId,
      activityTypeId,
      bookingDate,
      startTime,
      endTime,
    }: {
      userId: string;
      activityTypeId: string;
      bookingDate: Date;
      startTime: string;
      endTime: string;
    },
    { models, subdomain }: IContext,
  ) {
    return createBookingLogic(
      userId,
      activityTypeId,
      bookingDate,
      startTime,
      endTime,
      { models, subdomain } as IContext,
    );
  },

  async oneFitBookingCancel(
    _root: undefined,
    { _id, reason }: { _id: string; reason?: string },
    { models, user, subdomain }: IContext,
  ) {
    const booking = await models.Booking.findOne({ _id });
    if (!booking) {
      throw new Error('Booking not found');
    }

    const cancelledBy = user?._id || booking.userId;
    return cancelBookingLogic(
      _id,
      cancelledBy,
      reason,
      {
        models,
        subdomain,
      } as IContext,
      true,
    );
  },

  async oneFitBookingMarkAttendance(
    _root: undefined,
    {
      _id,
      attendanceStatus,
    }: { _id: string; attendanceStatus: AttendanceStatus },
    { models, user, instanceId }: IContext,
  ) {
    const booking = await models.Booking.findOne({ _id });
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Verify instanceId ownership if instanceId is set
    if (instanceId) {
      const provider = await models.Provider.findOne({
        _id: booking.providerId,
      });
      if (provider && provider.instanceId !== instanceId) {
        throw new Error('You do not have permission to modify this booking');
      }
    }

    // Get current user from context (should be provider)
    const markedBy = user?._id || '';

    return await models.Booking.markAttendance(_id, attendanceStatus, markedBy);
  },

  async oneFitBookingsRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.Booking.removeBookings(ids);
  },

  async cpOneFitBookingCreate(
    _root: undefined,
    {
      activityTypeId,
      bookingDate,
      startTime,
      endTime,
    }: {
      activityTypeId: string;
      bookingDate: Date;
      startTime: string;
      endTime: string;
    },
    { models, subdomain, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    return createBookingLogic(
      userId,
      activityTypeId,
      bookingDate,
      startTime,
      endTime,
      { models, subdomain } as IContext,
    );
  },

  async cpOneFitBookingCancel(
    _root: undefined,
    { _id, reason }: { _id: string; reason?: string },
    { models, subdomain, cpUser }: IContext,
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
      throw new Error('You do not have permission to cancel this booking');
    }

    if (booking.attendanceStatus === AttendanceStatus.NO_SHOW) {
      throw new Error('Cannot cancel a booking that was marked as no-show');
    }

    return cancelBookingLogic(_id, userId, reason, {
      models,
      subdomain,
    } as IContext);
  },
};

bookingMutations.cpOneFitBookingCreate.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

bookingMutations.cpOneFitBookingCancel.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};
