import { IContext } from '~/connectionResolvers';

const mushopSubscriptionPlanCreate = async (
  _root,
  { doc }: { doc: any },
  { models, checkPermission }: IContext,
) => {
  await checkPermission('mushopSubscriptionPlanCreate');
  return models.MushopSubscriptionPlan.createPlan(doc);
};

const mushopSubscriptionPlanUpdate = async (
  _root,
  { _id, doc }: { _id: string; doc: any },
  { models, checkPermission }: IContext,
) => {
  await checkPermission('mushopSubscriptionPlanUpdate');
  return models.MushopSubscriptionPlan.updatePlan(_id, doc);
};

const mushopSubscriptionPlanDeactivate = async (
  _root,
  { _id }: { _id: string },
  { models, checkPermission }: IContext,
) => {
  await checkPermission('mushopSubscriptionPlanDeactivate');
  return models.MushopSubscriptionPlan.deactivatePlan(_id);
};

export const subscriptionPlanMutations = {
  mushopSubscriptionPlanCreate,
  mushopSubscriptionPlanUpdate,
  mushopSubscriptionPlanDeactivate,
};
