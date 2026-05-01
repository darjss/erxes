import { IContext } from '~/connectionResolvers';
import { Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IMushopSubscriptionPlanDocument } from '@/subscription/@types/mushopSubscriptionPlan';

const mushopSubscriptionPlans: Resolver = async (
  _root,
  params,
  { models }: IContext,
) => {
  const { searchValue, isActive, ...cursorParams } = params;

  const query: Record<string, any> = {};

  if (typeof isActive === 'boolean') query.isActive = isActive;
  if (searchValue) query.name = { $regex: searchValue, $options: 'i' };

  return cursorPaginate<IMushopSubscriptionPlanDocument>({
    model: models.MushopSubscriptionPlan,
    params: cursorParams,
    query,
  });
};

const mushopSubscriptionPlanDetail: Resolver = async (
  _root,
  { _id },
  { models }: IContext,
) => {
  return models.MushopSubscriptionPlan.findOne({ _id }).lean();
};

export const subscriptionPlanQueries = {
  mushopSubscriptionPlans,
  mushopSubscriptionPlanDetail,
};
