import { nanoid } from 'nanoid';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

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

  let invoiceId = `manual:${nanoid()}`;

  try {
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
    });

    if (invoice?._id) {
      invoiceId = invoice._id;
    }
  } catch (e: any) {
    console.error(
      `[mushop:grant] invoice create failed; falling back to synthetic id. ${e.message}`,
    );
  }

  const existing = await models.MushopSubscription.getActiveSubscription(customerId);

  if (existing) {
    return models.MushopSubscription.renewSubscription(existing._id, {
      planId,
      invoiceId,
      amount,
      currency,
    });
  }

  const subscription = await models.MushopSubscription.createSubscription({
    customerId,
    planId,
    invoiceId,
    amount,
    currency,
  });

  await sendTRPCMessage({
    subdomain,
    pluginName: 'core',
    method: 'mutation',
    module: 'relation',
    action: 'createMultipleRelations',
    input: {
      relations: [
        {
          entities: [
            { contentType: 'mushop:subscription', contentId: subscription._id },
            { contentType: 'core:customer', contentId: customerId },
          ],
        },
      ],
    },
  });

  return subscription;
};

export const subscriptionMutations = {
  mushopCancelMySubscription,
  mushopCancelSubscription,
  mushopGrantSubscription,
};
