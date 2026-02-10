import {
  IBooking,
  IBookingDocument,
  BookingStatus,
  AttendanceStatus,
} from '@/booking/@types/booking';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { bookingSchema } from '../definitions/booking';

const BOOKING_NUMBER_PREFIX = 'BK-';
const SEQUENCE_LENGTH = 5;
const MAX_RETRIES = 3;
const MONGO_DUPLICATE_KEY_ERROR = 11000;

async function generateNextBookingNumber(
  BookingModel: IBookingModel,
): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${BOOKING_NUMBER_PREFIX}${year}${month}-`;

  const lastBooking = await BookingModel.findOne({
    bookingId: new RegExp(`^${prefix}\\d{${SEQUENCE_LENGTH}}$`),
  }).sort({ bookingId: -1 });

  let sequence = 1;
  if (lastBooking?.bookingId) {
    const lastSequence = parseInt(
      lastBooking.bookingId.slice(-SEQUENCE_LENGTH),
      10,
    );
    sequence = lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(SEQUENCE_LENGTH, '0')}`;
}

export type IBookingCreate = Omit<IBooking, 'bookingId'> & {
  bookingId?: string;
};

export interface IBookingModel extends Model<IBookingDocument> {
  createBooking(doc: IBookingCreate): Promise<IBookingDocument>;
  updateBooking(
    _id: string,
    doc: Partial<IBooking>,
  ): Promise<IBookingDocument>;
  findByUser(userId: string): Promise<IBookingDocument[]>;
  findByProvider(providerId: string): Promise<IBookingDocument[]>;
  findByProviderAndDate(
    providerId: string,
    date: Date,
  ): Promise<IBookingDocument[]>;
  countBookingsForSlot(
    providerId: string,
    activityTypeId: string,
    date: Date,
    startTime: string,
  ): Promise<number>;
  cancelBooking(
    _id: string,
    cancelledBy: string,
    reason?: string,
  ): Promise<IBookingDocument>;
  markAttendance(
    _id: string,
    status: AttendanceStatus,
    markedBy: string,
  ): Promise<IBookingDocument>;
  removeBookings(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadBookingClass = (models: IModels) => {
  class Booking {
    public static async createBooking(doc: IBookingCreate) {
      const model = models.Booking as IBookingModel;

      if (!doc.bookingId) {
        doc.bookingId = await generateNextBookingNumber(model);
      }

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          return await model.create({
            ...doc,
            status: BookingStatus.CONFIRMED,
            attendanceStatus: AttendanceStatus.PENDING,
            createdAt: new Date(),
          });
        } catch (err: unknown) {
          const mongoError = err as { code?: number };
          if (
            attempt < MAX_RETRIES &&
            mongoError?.code === MONGO_DUPLICATE_KEY_ERROR
          ) {
            doc.bookingId = await generateNextBookingNumber(model);
            continue;
          }
          throw err;
        }
      }

      throw new Error('Failed to create booking after retries');
    }

    public static async updateBooking(
      _id: string,
      doc: Partial<IBooking>,
    ) {
      return await models.Booking.findOneAndUpdate(
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

    public static async findByUser(userId: string) {
      return await models.Booking.find({ userId }).sort({ bookingDate: -1 });
    }

    public static async findByProvider(providerId: string) {
      return await models.Booking.find({ providerId }).sort({
        bookingDate: 1,
      });
    }

    public static async findByProviderAndDate(
      providerId: string,
      date: Date,
    ) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      return await models.Booking.find({
        providerId,
        bookingDate: { $gte: dateStart, $lte: dateEnd },
        status: { $ne: BookingStatus.CANCELLED },
      }).sort({ startTime: 1 });
    }

    public static async countBookingsForSlot(
      providerId: string,
      activityTypeId: string,
      date: Date,
      startTime: string,
    ) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      return await models.Booking.countDocuments({
        providerId,
        activityTypeId,
        bookingDate: { $gte: dateStart, $lte: dateEnd },
        startTime,
        status: { $ne: BookingStatus.CANCELLED },
      });
    }

    public static async cancelBooking(
      _id: string,
      cancelledBy: string,
      reason?: string,
    ) {
      return await models.Booking.findOneAndUpdate(
        { _id },
        {
          $set: {
            status: BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            cancelledBy,
            cancellationReason: reason,
            modifiedAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async markAttendance(
      _id: string,
      status: AttendanceStatus,
      markedBy: string,
    ) {
      const updateData: any = {
        attendanceStatus: status,
        markedBy,
        modifiedAt: new Date(),
      };

      if (status === AttendanceStatus.ATTENDED) {
        updateData.attendedAt = new Date();
        updateData.status = BookingStatus.COMPLETED;
      } else if (status === AttendanceStatus.NO_SHOW) {
        updateData.status = BookingStatus.NO_SHOW;
      }

      return await models.Booking.findOneAndUpdate({ _id }, { $set: updateData }, { new: true });
    }

    public static async removeBookings(ids: string[]) {
      return models.Booking.deleteMany({ _id: { $in: ids } });
    }
  }

  bookingSchema.loadClass(Booking);

  return bookingSchema;
};

