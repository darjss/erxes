import { ActivityLogInput } from 'erxes-api-shared/core-modules';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatAmount = (amount?: number, currency?: string) =>
  amount != null ? `${amount.toLocaleString()} ${currency || 'MNT'}` : null;

export const buildSubscriptionTarget = (sub: any) => ({
  _id: sub._id,
  entityId: sub.customerId,
});

export const buildSubscriptionCreatedLog = (
  sub: any,
  planName: string,
): ActivityLogInput => ({
  activityType: 'subscription.created',
  target: buildSubscriptionTarget(sub),
  action: {
    type: 'created',
    description: `Subscribed to "${planName}" — paid ${formatAmount(sub.amount, sub.currency)}, active from ${formatDate(sub.startDate)} to ${formatDate(sub.endDate)} (invoice: ${sub.invoiceId})`,
  },
  changes: {
    planId: sub.planId,
    startDate: sub.startDate,
    endDate: sub.endDate,
    amount: sub.amount,
    currency: sub.currency,
  },
  metadata: { invoiceId: sub.invoiceId },
});

export const buildSubscriptionExtendedLog = (
  sub: any,
  planName: string,
  prevEndDate: Date,
): ActivityLogInput => ({
  activityType: 'subscription.extended',
  target: buildSubscriptionTarget(sub),
  action: {
    type: 'extended',
    description: `Renewed "${planName}" — paid ${formatAmount(sub.amount, sub.currency)}, extended from ${formatDate(prevEndDate)} to ${formatDate(sub.endDate)} (invoice: ${sub.invoiceId})`,
  },
  changes: {
    prev: { endDate: prevEndDate },
    current: { endDate: sub.endDate },
  },
  metadata: { invoiceId: sub.invoiceId, planId: sub.planId },
});

export const buildSubscriptionEndDateAdjustedLog = (
  sub: any,
  planName: string,
  prevEndDate: Date,
): ActivityLogInput => ({
  activityType: 'subscription.endDateAdjusted',
  target: buildSubscriptionTarget(sub),
  action: {
    type: 'endDateAdjusted',
    description: `"${planName}" end date adjusted from ${formatDate(prevEndDate)} to ${formatDate(sub.endDate)}`,
  },
  changes: {
    prev: { endDate: prevEndDate },
    current: { endDate: sub.endDate },
  },
  metadata: { planId: sub.planId },
});

export const buildSubscriptionCancelledLog = (
  sub: any,
  planName: string,
): ActivityLogInput => ({
  activityType: 'subscription.cancelled',
  target: buildSubscriptionTarget(sub),
  action: {
    type: 'cancelled',
    description: `"${planName}" subscription cancelled — was active until ${formatDate(sub.endDate)}`,
  },
  changes: { status: 'cancelled' },
  metadata: { planId: sub.planId },
});

export const buildSubscriptionExpiredLog = (
  sub: any,
  planName: string,
): ActivityLogInput => ({
  activityType: 'subscription.expired',
  target: buildSubscriptionTarget(sub),
  action: {
    type: 'expired',
    description: `"${planName}" subscription expired — ended ${formatDate(sub.endDate)}, started ${formatDate(sub.startDate)}`,
  },
  changes: { status: 'expired' },
  metadata: { planId: sub.planId },
});
