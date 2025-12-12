import { IContext } from '~/connectionResolvers';
import { IMembershipPlan } from '@/membership/@types/membership';
import { processMembershipPurchase } from '../utils/membershipPurchase';

export const membershipMutations = {
  async oneFitMembershipPlanCreate(
    _root: undefined,
    doc: IMembershipPlan,
    { models }: IContext,
  ) {
    return await models.MembershipPlan.createPlan({ ...doc });
  },

  async oneFitMembershipPlanUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IMembershipPlan>,
    { models }: IContext,
  ) {
    return await models.MembershipPlan.updatePlan(_id, doc);
  },

  async oneFitMembershipPlansRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) {
    return await models.MembershipPlan.removePlans(ids);
  },

  async oneFitMembershipPurchaseCreate(
    _root: undefined,
    { userId, planId }: { userId: string; planId: string },
    context: IContext,
  ) {
    return await processMembershipPurchase(userId, planId, context);
  },
};
