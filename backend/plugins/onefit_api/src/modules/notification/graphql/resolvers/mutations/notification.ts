import { IContext } from '~/connectionResolvers';

export const notificationMutations = {
  async oneFitNotificationMarkAsRead(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.Notification.markAsRead(_id);
  },

  async oneFitNotificationsRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.Notification.removeNotifications(ids);
  },
};

