import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import { cursorPaginate, escapeRegExp } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export interface IPlanQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  isActive?: boolean;
}

export interface IPurchaseQueryParams extends ICursorPaginateParams {
  userId?: string;
  isExpired?: boolean;
  isInGracePeriod?: boolean;
}

const generatePlanFilter = async (params: IPlanQueryParams) => {
  const filter: any = {};

  if (params.searchValue) {
    filter.$or = [
      {
        name: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
    ];
  }

  if (params.isActive !== undefined) {
    filter.isActive = params.isActive;
  }

  return filter;
};

const generatePurchaseFilter = async (params: IPurchaseQueryParams) => {
  const filter: any = {};

  if (params.userId) {
    filter.userId = params.userId;
  }

  if (params.isExpired !== undefined) {
    filter.isExpired = params.isExpired;
  }

  if (params.isInGracePeriod !== undefined) {
    filter.isInGracePeriod = params.isInGracePeriod;
  }

  return filter;
};

export const membershipQueries = {
  async oneFitMembershipPlans(
    _root: undefined,
    params: IPlanQueryParams,
    { models }: IContext,
  ) {
    const filter = await generatePlanFilter(params);

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
    const filter = await generatePlanFilter(params);
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
};
