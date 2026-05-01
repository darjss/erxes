import { IContext } from '~/connectionResolvers';
import { Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { ICustomerSubscriptionDocument } from '@/subscription/@types/customerSubscription';

const mushopMySubscription: Resolver = async (
  _root,
  _args,
  { models, cpUser }: IContext,
) => {
  if (!cpUser) return null;

  return models.CustomerSubscription.getActiveSubscription(cpUser._id);
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

  const subsription = await models.CustomerSubscription.getActiveSubscription(
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
    query.$or = [
      { cpUserId: { $regex: searchValue, $options: 'i' } },
      { erxesCustomerId: { $regex: searchValue, $options: 'i' } },
    ];
  }

  return cursorPaginate<ICustomerSubscriptionDocument>({
    model: models.CustomerSubscription,
    params: cursorParams,
    query,
  });
};

const mushopSubscriptionDetail: Resolver = async (
  _root,
  { _id },
  { models }: IContext,
) => {
  return models.CustomerSubscription.findOne({ _id }).lean();
};

export const subscriptionQueries = {
  mushopMySubscription,
  mushopIsSubscribed,
  mushopSubscriptions,
  mushopSubscriptionDetail,
};
