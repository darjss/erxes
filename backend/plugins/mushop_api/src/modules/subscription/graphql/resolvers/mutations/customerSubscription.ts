import { IContext } from '~/connectionResolvers';
import { Resolver } from 'erxes-api-shared/core-types';

const mushopCancelMySubscription: Resolver = async (
  _root,
  { _id }: { _id: string },
  { models, cpUser }: IContext,
) => {
  if (!cpUser) throw new Error('Login required');

  const sub = await models.CustomerSubscription.findOne({
    _id,
    cpUserId: cpUser._id,
  });

  if (!sub) throw new Error('Subscription not found');

  return models.CustomerSubscription.cancelSubscription(_id);
};
mushopCancelMySubscription.wrapperConfig = { forClientPortal: true, cpUserRequired: true };

const mushopCancelSubscription: Resolver = async (
  _root,
  { _id }: { _id: string },
  { models }: IContext,
) => {
  const sub = await models.CustomerSubscription.findOne({ _id });
  if (!sub) throw new Error('Subscription not found');
  return models.CustomerSubscription.cancelSubscription(_id);
};

export const subscriptionMutations = {
  mushopCancelMySubscription,
  mushopCancelSubscription,
};
