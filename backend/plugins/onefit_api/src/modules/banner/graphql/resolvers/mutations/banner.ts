import { IContext } from '~/connectionResolvers';
import { IBanner, BannerStatus } from '@/banner/@types/banner';
import { requirePermission } from '~/utils/onefitPermissionCheck';

export const bannerMutations = {
  async oneFitBannerCreate(_root: undefined, doc: IBanner, context: IContext) {
    await requirePermission(context, 'bannerManage');
    const { models } = context;

    // Validate provider exists
    const provider = await models.Provider.findOne({ _id: doc.providerId });
    if (!provider) {
      throw new Error('Provider not found');
    }

    const instanceId = context.instanceId;

    return await models.Banner.createBanner({
      ...doc,
      status: doc.status || BannerStatus.ACTIVE,
      instanceId,
    });
  },

  async oneFitBannerUpdate(
    _root: undefined,
    { _id, ...doc }: { _id: string } & Partial<IBanner>,
    context: IContext,
  ) {
    await requirePermission(context, 'bannerManage');
    const { models } = context;
    const banner = await models.Banner.findOne({ _id });

    if (!banner) {
      throw new Error('Banner not found');
    }

    if (
      banner.instanceId &&
      context.instanceId &&
      banner.instanceId !== context.instanceId
    ) {
      throw new Error('Banner not found');
    }

    // Validate provider exists if providerId is being updated
    if (doc.providerId) {
      const provider = await models.Provider.findOne({ _id: doc.providerId });
      if (!provider) {
        throw new Error('Provider not found');
      }
    }

    return await models.Banner.updateBanner(_id, { ...doc });
  },

  async oneFitBannersRemove(
    _root: undefined,
    { ids }: { ids: string[] },
    context: IContext,
  ) {
    await requirePermission(context, 'bannerManage');
    const { models, instanceId } = context;

    if (ids && ids.length > 0 && instanceId) {
      const banners = await models.Banner.find({
        _id: { $in: ids },
        instanceId,
      });

      if (banners.length !== ids.length) {
        throw new Error(
          'One or more banners not found or do not belong to this instance',
        );
      }
    }

    return await models.Banner.removeBanners(ids);
  },
};
