import { IContext } from '~/connectionResolvers';
import { TIER_LEVELS } from '~/constants';
import { IBlockDeveloper } from '~/modules/developer/db/@types/developer';

export default {
  projectsCount: async (
    { subdomain }: IBlockDeveloper,
    _args: undefined,
    { models }: IContext,
  ) => {
    const developer = await models.Developer.findOne({ subdomain }).lean();

    return await models.Project.countDocuments({
      subdomain: developer?.subdomain,
    });
  },
  tier: async ({ tierLevel }: IBlockDeveloper) => {
    if (!tierLevel) {
      return null;
    }

    return TIER_LEVELS[tierLevel] || 'Unknown';
  },
  isFeatured: async ({ tierLevel }: IBlockDeveloper) => {
    return Boolean(tierLevel);
  },
};
