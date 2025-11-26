import { IContext } from '~/connectionResolvers';
import { IBlockDeveloperDocument } from '~/modules/developer/db/@types/developer';

export default {
  projectsCounts: async (
    { _id }: IBlockDeveloperDocument,
    _args: any,
    { models }: IContext,
  ) => {
    return models.Project.countDocuments({ developer: _id });
  },
};
