import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { NotificationType } from '@/notification/@types/notification';

export interface INotificationQueryParams extends ICursorPaginateParams {
  userId?: string;
  providerId?: string;
  companyId?: string;
  type?: NotificationType;
  isRead?: boolean;
}

const generateFilter = async (params: INotificationQueryParams) => {
  const filter: any = {};

  if (params.userId) {
    filter.userId = params.userId;
  }

  if (params.providerId) {
    filter.providerId = params.providerId;
  }

  if (params.companyId) {
    filter.companyId = params.companyId;
  }

  if (params.type) {
    filter.type = params.type;
  }

  if (params.isRead !== undefined) {
    filter.isRead = params.isRead;
  }

  return filter;
};

export const notificationQueries = {
  async oneFitNotifications(
    _root: undefined,
    params: INotificationQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);

    return await cursorPaginate({
      model: models.Notification,
      params,
      query: filter,
    });
  },

  async oneFitNotificationsCount(
    _root: undefined,
    params: INotificationQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.Notification.find(filter).countDocuments();
  },

  async oneFitNotification(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.Notification.findOne({ _id });
  },

  async oneFitUserNotifications(
    _root: undefined,
    { userId, unreadOnly }: { userId: string; unreadOnly?: boolean },
    { models }: IContext,
  ) {
    return models.Notification.findByUser(userId, unreadOnly);
  },
};
