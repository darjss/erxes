import { IContext } from '~/connectionResolvers';
import { IMembershipPlan } from '@/membership/@types/membership';
import {
  createMembershipPurchaseInvoice,
  activateMembershipPurchase,
} from '../utils/membershipPurchase';

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
    {
      userId,
      planId,
      paymentId,
    }: { userId: string; planId: string; paymentId: string },
    context: IContext,
  ) {
    return await createMembershipPurchaseInvoice(userId, planId, paymentId, context);
  },

  async oneFitMembershipPurchaseActivate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    return await activateMembershipPurchase(_id, context);
  },
};
