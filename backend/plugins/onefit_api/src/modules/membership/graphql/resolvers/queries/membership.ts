import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { generatePlanFilter, generatePurchaseFilter } from '../utils/filters';

export interface IPlanQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  isActive?: boolean;
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
      params: paginationParams,
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
};
markResolvers(membershipQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
