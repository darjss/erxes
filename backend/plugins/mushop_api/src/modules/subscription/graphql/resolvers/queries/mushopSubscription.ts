import { IContext } from '~/connectionResolvers';
import { Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate, sendTRPCMessage } from 'erxes-api-shared/utils';
import { IMushopSubscriptionDocument } from '@/subscription/@types/mushopSubscription';

const mushopMySubscription: Resolver = async (
  _root,
  _args,
  { models, cpUser }: IContext,
) => {
  if (!cpUser) return null;

  return models.MushopSubscription.getActiveSubscription(
    cpUser.erxesCustomerId || cpUser._id,
  );
};

mushopMySubscription.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

const mushopIsSubscribed: Resolver = async (
  _root,
  _args,
  { models, cpUser }: IContext,
) => {
  if (!cpUser) return false;

  const subsription = await models.MushopSubscription.getActiveSubscription(
    cpUser._id,
  );

  return Boolean(subsription);
};
mushopIsSubscribed.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

const mushopSubscriptions: Resolver = async (
  _root,
  params,
  { models, subdomain }: IContext,
) => {
  const { searchValue, status, ...cursorParams } = params;

  const query: Record<string, any> = {};

  if (status) query.status = status;

  if (searchValue) {
    // Search customers by name, phone, email in core-api
    const customers = await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'contacts',
      action: 'customers.find',
      input: {
        query: {
          $or: [
            { primaryEmail: { $regex: searchValue, $options: 'i' } },
            { primaryPhone: { $regex: searchValue, $options: 'i' } },
            { 'details.firstName': { $regex: searchValue, $options: 'i' } },
            { 'details.lastName': { $regex: searchValue, $options: 'i' } },
          ],
          status: { $ne: 'deleted' },
        },
      },
    });

    const customerIds = (customers || []).map((c) => c._id);

    query.customerId = { $in: customerIds };
  }

  return cursorPaginate<IMushopSubscriptionDocument>({
    model: models.MushopSubscription,
    params: { ...cursorParams, orderBy: { createdAt: -1 } },
    query,
  });
};

const mushopSubscriptionDetail: Resolver = async (
  _root,
  { _id },
  { models }: IContext,
) => {
  return models.MushopSubscription.findOne({ _id }).lean();
};

export const subscriptionQueries = {
  mushopMySubscription,
  mushopIsSubscribed,
  mushopSubscriptions,
  mushopSubscriptionDetail,
};

export const subscriptionTypeResolvers = {
  MushopSubscription: {
    plan: async (sub, _args, { models }: IContext) => {
      if (!sub.planId) return null;
      return models.MushopSubscriptionPlan.findOne({ _id: sub.planId }).lean();
    },
    customer: async (sub, _args, { subdomain }: IContext) => {
      if (!sub.customerId) return null;
      return sendTRPCMessage({
        subdomain,
        pluginName: 'core',
        method: 'query',
        module: 'contacts',
        action: 'customers.findOne',
        input: { query: { _id: sub.customerId } },
      });
    },
  },
};
