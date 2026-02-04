import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { generatePlanFilter, generatePurchaseFilter } from '../utils/filters';

export interface IPlanQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  isActive?: boolean;
  planType?: string;
}

export interface IPurchaseQueryParams extends ICursorPaginateParams {
  userId?: string;
  isExpired?: boolean;
  isInGracePeriod?: boolean;
}

export interface IMembershipPurchaseQueryParams extends ICursorPaginateParams {
  userId?: string;
  status?: string;
  planId?: string;
}

export interface ICPMembershipPurchaseQueryParams
  extends ICursorPaginateParams {
  status?: string;
  planId?: string;
}

export const membershipQueries: Record<string, Resolver> = {
  async oneFitMembershipPlans(
    _root: undefined,
    params: IPlanQueryParams,
    { models }: IContext,
  ) {
    const filter = generatePlanFilter(params);

    return await cursorPaginate({
      model: models.MembershipPlan,
      params,
      query: filter,
    });
  },

  async oneFitMembershipPlansCount(
    _root: undefined,
    params: IPlanQueryParams,
    { models }: IContext,
  ) {
    const filter = generatePlanFilter(params);
    return models.MembershipPlan.find(filter).countDocuments();
  },

  async oneFitMembershipPlan(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.MembershipPlan.findOne({ _id });
  },

  async oneFitActiveMembershipPlans(
    _root: undefined,
    _params: undefined,
    { models }: IContext,
  ) {
    return models.MembershipPlan.findActivePlans();
  },

  async oneFitMembershipPurchases(
    _root: undefined,
    params: IMembershipPurchaseQueryParams,
    { models }: IContext,
  ) {
    const { userId, status, planId, ...paginationParams } = params;

    const filter: any = {};
    if (userId) {
      filter.userId = userId;
    }
    if (status) {
      filter.status = status;
    }
    if (planId) {
      filter.planId = planId;
    }

    return await cursorPaginate({
      model: models.MembershipPurchase,
      params: {
        ...paginationParams,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });
  },

  async oneFitMembershipPurchase(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.MembershipPurchase.getPurchase(_id);
  },

  async cpOneFitMembershipPurchases(
    _root: undefined,
    params: ICPMembershipPurchaseQueryParams,
    { models, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const { status, planId, ...paginationParams } = params;

    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }
    if (planId) {
      filter.planId = planId;
    }

    return await cursorPaginate({
      model: models.MembershipPurchase,
      params: {
        ...paginationParams,
        orderBy: { createdAt: -1 },
      },
      query: filter,
    });
  },

  async cpOneFitMembershipPurchase(
    _root: undefined,
    { _id }: { _id: string },
    { models, cpUser }: IContext,
  ) {
    if (!cpUser) {
      throw new Error('Client portal user required');
    }

    const userId = cpUser.erxesCustomerId || cpUser._id;
    const purchase = await models.MembershipPurchase.getPurchase(_id);

    if (purchase.userId !== userId) {
      throw new Error('You do not have permission to view this purchase');
    }

    return purchase;
  },
};
markResolvers(membershipQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});

membershipQueries.cpOneFitMembershipPurchases.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};

membershipQueries.cpOneFitMembershipPurchase.wrapperConfig = {
  forClientPortal: true,
  cpUserRequired: true,
};
