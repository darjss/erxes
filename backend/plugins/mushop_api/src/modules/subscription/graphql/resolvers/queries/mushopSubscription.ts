import { IContext } from '~/connectionResolvers';
import { Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
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
  { models }: IContext,
) => {
  const { searchValue, status, ...cursorParams } = params;

  const query: Record<string, any> = {};

  if (status) query.status = status;

  if (searchValue) {
    query.customerId = { $regex: searchValue, $options: 'i' };
  }

  return cursorPaginate<IMushopSubscriptionDocument>({
    model: models.MushopSubscription,
    params: cursorParams,
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
  },
};
