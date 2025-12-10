import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export interface IOneFitCustomerQueryParams extends ICursorPaginateParams {
  membershipPlanId?: string;
  membershipStatus?: 'active' | 'expired' | 'none';
  minCreditBalance?: number;
  maxCreditBalance?: number;
  preferredActivityTypeId?: string;
}

const generateFilter = async (params: IOneFitCustomerQueryParams) => {
  const filter: any = {
    __t: 'OneFitCustomer',
  };

  if (params.membershipPlanId) {
    filter.membershipPlanId = params.membershipPlanId;
  }

  if (params.membershipStatus) {
    filter.membershipStatus = params.membershipStatus;
  }

  if (
    params.minCreditBalance !== undefined ||
    params.maxCreditBalance !== undefined
  ) {
    filter.currentCreditBalance = {};
    if (params.minCreditBalance !== undefined) {
      filter.currentCreditBalance.$gte = params.minCreditBalance;
    }
    if (params.maxCreditBalance !== undefined) {
      filter.currentCreditBalance.$lte = params.maxCreditBalance;
    }
  }

  if (params.preferredActivityTypeId) {
    filter.preferredActivityTypes = params.preferredActivityTypeId;
  }

  return filter;
};

export const oneFitCustomerQueries: Record<string, Resolver> = {
  async oneFitCustomers(
    _root: undefined,
    params: IOneFitCustomerQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);

    return await cursorPaginate({
      model: models.OneFitCustomer,
      params,
      query: filter,
    });
  },

  async oneFitCustomer(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.OneFitCustomer.findOne({ _id, __t: 'OneFitCustomer' });
  },

  async oneFitCustomersCount(
    _root: undefined,
    params: IOneFitCustomerQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.OneFitCustomer.find(filter).countDocuments();
  },
};
markResolvers(oneFitCustomerQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
