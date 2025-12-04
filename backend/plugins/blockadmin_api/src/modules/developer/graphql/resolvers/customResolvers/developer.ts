import { IContext } from '~/connectionResolvers';
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
};
