import { Document } from 'mongoose';

export enum NotificationType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CANCELLATION = 'booking_cancellation',
  CREDIT_EXPIRATION = 'credit_expiration',
  GRACE_PERIOD_START = 'grace_period_start',
  GRACE_PERIOD_ENDING = 'grace_period_ending',
  PLAN_EXPIRATION = 'plan_expiration',
  NEW_BOOKING = 'new_booking',
  SCHEDULE_CONFLICT = 'schedule_conflict',
  PROVIDER_REGISTRATION = 'provider_registration',
  LOW_CREDIT_POOL = 'low_credit_pool',
}

export enum NotificationChannel {
  SMS = 'sms',
  IN_APP = 'in_app',
  EMAIL = 'email',
}

export interface INotification {
  userId?: string;
  providerId?: string;
  companyId?: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string; // Booking ID, Purchase ID, etc.
  sentAt?: Date;
  readAt?: Date;
  createdAt?: Date;
}

export interface INotificationDocument extends Document, INotification {
  _id: string;
  createdAt: Date;
}

