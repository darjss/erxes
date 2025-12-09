import {
  INotification,
  INotificationDocument,
} from '@/notification/@types/notification';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { notificationSchema } from '../definitions/notification';

export interface INotificationModel extends Model<INotificationDocument> {
  createNotification(doc: INotification): Promise<INotificationDocument>;
  markAsRead(_id: string): Promise<INotificationDocument>;
  findByUser(userId: string, unreadOnly?: boolean): Promise<INotificationDocument[]>;
  removeNotifications(ids: string[]): Promise<{ n: number; ok: number }>;
}

export const loadNotificationClass = (models: IModels) => {
  class Notification {
    public static async createNotification(doc: INotification) {
      return await models.Notification.create({
        ...doc,
        sentAt: new Date(),
        createdAt: new Date(),
      });
    }

    public static async markAsRead(_id: string) {
      return await models.Notification.findOneAndUpdate(
        { _id },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        },
        { new: true },
      );
    }

    public static async findByUser(userId: string, unreadOnly: boolean = false) {
      const filter: any = { userId };
      if (unreadOnly) {
        filter.isRead = false;
      }
      return await models.Notification.find(filter).sort({ createdAt: -1 });
    }

    public static async removeNotifications(ids: string[]) {
      return models.Notification.deleteMany({ _id: { $in: ids } });
    }
  }

  notificationSchema.loadClass(Notification);

  return notificationSchema;
};

