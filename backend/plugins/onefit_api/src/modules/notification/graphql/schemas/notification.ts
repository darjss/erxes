export const types = `
  enum OneFitNotificationType {
    booking_confirmation
    booking_reminder
    booking_cancellation
    credit_expiration
    grace_period_start
    grace_period_ending
    plan_expiration
    new_booking
    schedule_conflict
    provider_registration
    low_credit_pool
  }

  enum OneFitNotificationChannel {
    sms
    in_app
    email
  }

  type OneFitNotification {
    _id: String
    createdAt: Date
    userId: String
    providerId: String
    companyId: String
    type: OneFitNotificationType
    channel: OneFitNotificationChannel
    title: String
    message: String
    isRead: Boolean
    relatedId: String
    sentAt: Date
    readAt: Date
  }

  type OneFitNotificationListResponse {
    list: [OneFitNotification]
    pageInfo: PageInfo
    totalCount: Int
  }
`;

const notificationQueryParams = `
  userId: String,
  providerId: String,
  companyId: String,
  type: OneFitNotificationType,
  isRead: Boolean,
`;

import { GQL_CURSOR_PARAM_DEFS } from 'erxes-api-shared/utils';

export const queries = `
  oneFitNotifications(${notificationQueryParams}, ${GQL_CURSOR_PARAM_DEFS}): OneFitNotificationListResponse
  oneFitNotificationsCount(${notificationQueryParams}): Int
  oneFitNotification(_id: String): OneFitNotification
  oneFitUserNotifications(userId: String!, unreadOnly: Boolean): [OneFitNotification]
`;

export const mutations = `
  oneFitNotificationMarkAsRead(_id: String!): OneFitNotification
  oneFitNotificationsRemove(ids: [String]!): JSON
`;
