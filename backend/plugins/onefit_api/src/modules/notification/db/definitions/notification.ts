import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import {
  NotificationType,
  NotificationChannel,
} from '@/notification/@types/notification';

export const notificationSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },

    companyId: { type: String, label: 'Company ID' },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      label: 'Notification Type',
    },
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      required: true,
      label: 'Notification Channel',
    },
    title: { type: String, required: true, label: 'Title' },
    message: { type: String, required: true, label: 'Message' },
    isRead: { type: Boolean, default: false, label: 'Is Read' },
    relatedId: { type: String, index: true, label: 'Related ID' },
    sentAt: { type: Date, label: 'Sent At' },
    readAt: { type: Date, label: 'Read At' },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ companyId: 1, createdAt: -1 });

