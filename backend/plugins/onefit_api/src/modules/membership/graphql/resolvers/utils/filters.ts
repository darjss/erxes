import { escapeRegExp } from 'erxes-api-shared/utils';
import { IPlanQueryParams, IPurchaseQueryParams } from '../queries/membership';

export function generatePlanFilter(params: IPlanQueryParams) {
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

  if (params.planType) {
    filter.planType = params.planType;
  }

  return filter;
}

export function generatePurchaseFilter(params: IPurchaseQueryParams) {
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
}
