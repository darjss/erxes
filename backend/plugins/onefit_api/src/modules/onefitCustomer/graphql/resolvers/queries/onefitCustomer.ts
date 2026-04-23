import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  markResolvers,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ifTeamUserCheck } from '~/utils/onefitPermissionCheck';

export interface IOneFitCustomerQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  phone?: string;
  email?: string;
  membershipPlanId?: string;
  membershipStatus?: 'active' | 'expired' | 'none';
  graceMode?: boolean;
  minCreditBalance?: number;
  maxCreditBalance?: number;
  preferredActivityTypeId?: string;
  type?: 'onefit' | 'erxes';
}

const generateFilter = async (params: IOneFitCustomerQueryParams) => {
  const filter: any = {};

  if (!params.type || params.type === 'onefit') {
    filter.__t = 'OneFitCustomer';
  }

  if (params.phone) {
    filter.primaryPhone = {
      $regex: `.*${escapeRegExp(params.phone)}.*`,
      $options: 'i',
    };
  }

  if (params.email) {
    filter.primaryEmail = {
      $regex: `.*${escapeRegExp(params.email)}.*`,
      $options: 'i',
    };
  }

  if (params.searchValue) {
    filter.$or = [
      {
        firstName: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        lastName: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        primaryEmail: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
      {
        primaryPhone: {
          $regex: `.*${escapeRegExp(params.searchValue)}.*`,
          $options: 'i',
        },
      },
    ];
  }

  if (params.membershipPlanId) {
    filter.membershipPlanId = params.membershipPlanId;
  }

  if (params.membershipStatus) {
    filter.membershipStatus = params.membershipStatus;
  }

  if (params.graceMode === true) {
    filter.isInGracePeriod = true;
  } else if (params.graceMode === false) {
    filter.isInGracePeriod = { $ne: true };
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
    context: IContext,
  ) {
    const { models } = context;
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
    context: IContext,
  ) {
    const { models } = context;
    return await models.OneFitCustomer.findOne({ _id, __t: 'OneFitCustomer' });
  },

  async oneFitCustomersCount(
    _root: undefined,
    params: IOneFitCustomerQueryParams,
    context: IContext,
  ) {
    const { models } = context;
    const filter = await generateFilter(params);
    return models.OneFitCustomer.find(filter).countDocuments();
  },

  async oneFitCustomersByCompanyId(
    _root: undefined,
    { companyId }: { companyId: string },
    context: IContext,
  ) {
    const { subdomain } = context;
    const customerIds = (await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'relation',
      action: 'getRelationIds',
      input: {
        contentType: 'core:company',
        contentId: companyId,
        relatedContentType: 'core:customer',
      },
      defaultValue: [] as string[],
    })) as string[];

    const ids = customerIds?.filter((id) => id && id.trim()) ?? [];
    if (!ids.length) {
      return [];
    }

    const customers = (await sendTRPCMessage({
      subdomain,
      pluginName: 'core',
      method: 'query',
      module: 'customers',
      action: 'find',
      input: {
        query: {
          _id: { $in: ids },
          status: { $ne: 'deleted' },
        },
      },
      defaultValue: [] as Array<{
        _id: string;
        primaryPhone?: string;
        primaryEmail?: string;
      }>,
    })) as Array<{ _id: string; primaryPhone?: string; primaryEmail?: string }>;

    return customers.map((c) => ({
      _id: c._id,
      primaryPhone: c.primaryPhone ?? undefined,
      primaryEmail: c.primaryEmail ?? undefined,
    }));
  },
};
markResolvers(oneFitCustomerQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
