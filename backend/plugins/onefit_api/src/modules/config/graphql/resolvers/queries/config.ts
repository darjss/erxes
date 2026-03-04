import { ICursorPaginateParams } from 'erxes-api-shared/core-types';
import {
  cursorPaginate,
  escapeRegExp,
  getEnv,
  getSaasOrganizationIdBySubdomain,
} from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export interface IConfigQueryParams extends ICursorPaginateParams {
  searchValue?: string;
  key?: string;
}

const generateFilter = async (params: IConfigQueryParams) => {
  const filter: any = {};

  if (params.searchValue) {
    filter.$or = [
      {
        key: {
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

  if (params.key) {
    filter.key = params.key;
  }

  return filter;
};

export const configQueries = {
  async systemConfigs(
    _root: undefined,
    params: IConfigQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);

    return await cursorPaginate({
      model: models.SystemConfig,
      params,
      query: filter,
    });
  },

  async systemConfigsCount(
    _root: undefined,
    params: IConfigQueryParams,
    { models }: IContext,
  ) {
    const filter = await generateFilter(params);
    return models.SystemConfig.find(filter).countDocuments();
  },

  async systemConfig(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.SystemConfig.findOne({ _id });
  },

  async systemConfigByKey(
    _root: undefined,
    { key }: { key: string },
    { models }: IContext,
  ) {
    return models.SystemConfig.getConfig(key);
  },

  async oneFitSystemConfigByKey(
    _root: undefined,
    { key }: { key: string },
    { models }: IContext,
  ) {
    return models.SystemConfig.getConfig(key);
  },

  async allSystemConfigs(
    _root: undefined,
    _params: undefined,
    { models }: IContext,
  ) {
    return models.SystemConfig.getAllConfigs();
  },

  async oneFitMode(_root: undefined, _params: undefined, context: IContext) {
    return context.mode;
  },

  async oneFitMasterUrl(
    _root: undefined,
    _params: undefined,
    context: IContext,
  ) {
    return context.masterUrl;
  },

  async oneFitInstanceId(
    _root: undefined,
    _params: undefined,
    context: IContext,
  ) {
    return context.instanceId;
  },

  async oneFitSuggestedInstanceId(
    _root: undefined,
    _params: undefined,
    context: IContext,
  ): Promise<string | null> {
    const VERSION = getEnv({ name: 'VERSION', defaultValue: 'os' });
    if (VERSION !== 'saas') {
      return null;
    }
    try {
      return await getSaasOrganizationIdBySubdomain(context.subdomain);
    } catch {
      return null;
    }
  },
};
