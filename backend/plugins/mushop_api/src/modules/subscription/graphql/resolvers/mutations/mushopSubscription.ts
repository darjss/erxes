import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { linkRelation } from '~/utils/relation';

const mushopCancelMySubscription = async (
  _root,
  { _id }: { _id: string },
  { models, cpUser }: IContext,
) => {
  if (!cpUser) throw new Error('Login required');

  const sub = await models.MushopSubscription.findOne({
    _id,
    customerId: cpUser.erxesCustomerId || cpUser._id,
  });

  if (!sub) throw new Error('Subscription not found');

  return models.MushopSubscription.cancelSubscription(_id);
};
mushopCancelMySubscription.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

const mushopCancelSubscription = async (
  _root,
  { _id }: { _id: string },
  { models, checkPermission }: IContext,
) => {
  await checkPermission('mushopCancelSubscription');
  const sub = await models.MushopSubscription.findOne({ _id });
  if (!sub) throw new Error('Subscription not found');
  return models.MushopSubscription.cancelSubscription(_id);
};

const mushopGrantSubscription = async (
  _root,
  {
    customerId,
    planId,
    paymentId,
    amount: amountInput,
  }: {
    customerId: string;
    planId: string;
    paymentId?: string;
    amount?: number;
  },
  { models, subdomain, checkPermission }: IContext,
) => {
  await checkPermission('mushopGrantSubscription');
  if (!customerId) throw new Error('customerId is required');
  if (!planId) throw new Error('planId is required');

  const plan = await models.MushopSubscriptionPlan.findOne({ _id: planId }).lean();
  if (!plan) throw new Error('Subscription plan not found');

  const amount = amountInput != null ? amountInput : plan.price;
  const currency = plan.currency || 'MNT';

  const invoice = await sendTRPCMessage({
    subdomain,
    pluginName: 'payment',
    method: 'mutation',
    module: 'payment',
    action: 'addInvoice',
    input: {
      amount,
      currency,
      customerId,
      customerType: 'customer',
      contentType: 'mushop:subscription',
      contentTypeId: customerId,
      description: `Mushop — ${plan.name}`,
      paymentIds: paymentId ? [paymentId] : [],
      status: 'paid',
      resolvedAt: new Date(),
      data: { planId, manual: true },
    },
    defaultValue: null,
  });

  if (!invoice?._id) {
    throw new Error('Failed to create invoice for subscription grant');
  }

  const existing = await models.MushopSubscription.getActiveSubscription(customerId);

  if (existing) {
    return models.MushopSubscription.renewSubscription(existing._id, {
      planId,
      invoiceId: invoice._id,
      amount,
      currency,
    });
  }

  const subscription = await models.MushopSubscription.createSubscription({
    customerId,
    planId,
    invoiceId: invoice._id,
    amount,
    currency,
  });

  await linkRelation({
    subdomain,
    main: { contentType: 'mushop:subscription', contentId: subscription._id },
    related: [
      { contentType: 'core:customer', contentId: customerId },
      { contentType: 'payment:invoice', contentId: invoice._id },
    ],
  });

  return subscription;
};

const mushopUpdateSubscriptionEndDate = async (
  _root,
  { _id, endDate }: { _id: string; endDate: Date },
  { models, checkPermission }: IContext,
) => {
  await checkPermission('mushopUpdateSubscriptionEndDate');
  if (!_id) throw new Error('_id is required');
  if (!endDate) throw new Error('endDate is required');

  return models.MushopSubscription.updateEndDate(_id, endDate);
};

const mushopUpdateSubscriptionStatus = async (
  _root,
  { _id, status }: { _id: string; status: string },
  { models, checkPermission }: IContext,
) => {
  await checkPermission('mushopUpdateSubscriptionStatus');
  if (!_id) throw new Error('_id is required');
  if (!status) throw new Error('status is required');

  return models.MushopSubscription.updateStatus(_id, status);
};

export const subscriptionMutations = {
  mushopCancelMySubscription,
  mushopCancelSubscription,
  mushopGrantSubscription,
  mushopUpdateSubscriptionEndDate,
  mushopUpdateSubscriptionStatus,
};
