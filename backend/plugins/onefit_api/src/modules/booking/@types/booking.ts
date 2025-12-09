import { Document } from 'mongoose';

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export enum AttendanceStatus {
  PENDING = 'pending',
  ATTENDED = 'attended',
  NO_SHOW = 'no_show',
}

export interface IBooking {
  userId: string; // User ID who made the booking
  providerId: string; // Provider ID (derived from activityType)
  activityTypeId: string;
  bookingDate: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  creditCost: number;
  status: BookingStatus;
  attendanceStatus: AttendanceStatus;
  bookingId: string; // Unique booking identifier
  cancelledAt?: Date;
  cancelledBy?: string; // User ID who cancelled
  cancellationReason?: string;
  attendedAt?: Date;
  markedBy?: string; // Provider user ID who marked attendance
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IBookingDocument extends Document, IBooking {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}
