import { IContext } from '~/connectionResolvers';
import { IBlockDeveloperDocument } from '~/modules/developer/db/@types/developer';

export default {
  projectsCounts: async (
    { _id }: IBlockDeveloperDocument,
    _args: any,
    { models }: IContext,
  ) => {
    const dev = await models.Developer.findOne({ _id }).lean();

    if (!dev?.subdomain) return 0;

    return models.Project.countDocuments({ subdomain: dev.subdomain });
  },
};
