import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { BookingStatus, AttendanceStatus } from '@/booking/@types/booking';

export const bookingSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    userId: {
      type: String,
      required: true,
      index: true,
      label: 'User ID',
    },
    providerId: {
      type: String,
      required: true,
      index: true,
      label: 'Provider ID',
    },
    activityTypeId: {
      type: String,
      required: true,
      index: true,
      label: 'Activity Type ID',
    },
    bookingDate: { type: Date, required: true, label: 'Booking Date' },
    startTime: { type: String, required: true, label: 'Start Time' }, // HH:mm
    endTime: { type: String, required: true, label: 'End Time' }, // HH:mm
    creditCost: { type: Number, required: true, label: 'Credit Cost' },
    price: { type: Number, label: 'Price' },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.CONFIRMED,
      label: 'Status',
    },
    attendanceStatus: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.PENDING,
      label: 'Attendance Status',
    },
    bookingId: {
      type: String,
      required: true,
      unique: true,
      label: 'Booking ID',
    },
    cancelledAt: { type: Date, label: 'Cancelled At' },
    cancelledBy: { type: String, label: 'Cancelled By' },
    cancellationReason: { type: String, label: 'Cancellation Reason' },
    attendedAt: { type: Date, label: 'Attended At' },
    markedBy: { type: String, label: 'Marked By' },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ providerId: 1, bookingDate: 1 });
bookingSchema.index({ userId: 1, activityTypeId: 1, bookingDate: 1 });
