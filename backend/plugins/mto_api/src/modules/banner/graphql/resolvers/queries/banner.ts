import { ICursorPaginateParams, Resolver } from 'erxes-api-shared/core-types';
import { cursorPaginate, markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { BannerType, BannerStatus } from '@/banner/@types/banner';

export interface IBannerQueryParams extends ICursorPaginateParams {
  providerId?: string;
  type?: string;
  status?: string;
}

const generateFilter = async (
  params: IBannerQueryParams,
  instanceId?: string,
) => {
  const filter: any = {};

  if (instanceId) {
    filter.instanceId = instanceId;
  }

  if (params.providerId) {
    filter.providerId = params.providerId;
  }

  if (params.type) {
    filter.type = params.type;
  }

  if (params.status) {
    filter.status = params.status;
  }

  return filter;
};

export const bannerQueries: Record<string, Resolver> = {
  async mtoBanners(
    _root: undefined,
    params: IBannerQueryParams,
    context: IContext,
  ) {
    const { models, instanceId } = context;

    const filter = await generateFilter(params, instanceId);

    return await cursorPaginate({
      model: models.Banner,
      params,
      query: filter,
    });
  },

  async mtoBannersCount(
    _root: undefined,
    params: IBannerQueryParams,
    context: IContext,
  ) {
    const { models, instanceId } = context;

    const filter = await generateFilter(params, instanceId);
    return models.Banner.find(filter).countDocuments();
  },

  async mtoBanner(
    _root: undefined,
    { _id }: { _id: string },
    context: IContext,
  ) {
    const { models, instanceId } = context;

    const banner = await models.Banner.findOne({ _id });
    if (banner && instanceId && banner.instanceId !== instanceId) {
      return null;
    }
    return banner;
  },
};

markResolvers(bannerQueries, {
  wrapperConfig: {
    skipPermission: true,
  },
});
