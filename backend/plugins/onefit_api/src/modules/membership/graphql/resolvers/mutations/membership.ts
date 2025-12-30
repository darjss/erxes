import { IContext } from '~/connectionResolvers';
import { IMembershipPlan } from '@/membership/@types/membership';
import {
  createMembershipPurchaseInvoice,
  activateMembershipPurchase,
} from '../utils/membershipPurchase';
import { Resolver } from 'erxes-api-shared/core-types';

export const membershipMutations: Record<string, Resolver> = {
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
    return await createMembershipPurchaseInvoice(userId, planId, context);
  },

  async oneFitMembershipPurchaseActivate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    return await activateMembershipPurchase(_id, context);
  },

  async cpOneFitMembershipPurchaseCreate(
    _root: undefined,
    { planId }: { planId: string },
    context: IContext,
  ) {
    const { cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    return await createMembershipPurchaseInvoice(userId, planId, context);
  },

  async cpOneFitMembershipPurchaseActivate(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, cpUser } = context;
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;

    // Verify ownership
    const purchase = await models.MembershipPurchase.getPurchase(_id);

    if (purchase.userId !== userId) {
      throw new Error('You do not have permission to activate this purchase');
    }

    return await activateMembershipPurchase(_id, context);
  },
};

membershipMutations.cpOneFitMembershipPurchaseCreate.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

membershipMutations.cpOneFitMembershipPurchaseActivate.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};
