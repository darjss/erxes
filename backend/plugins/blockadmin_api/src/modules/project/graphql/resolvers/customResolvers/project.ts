import { IContext } from '~/connectionResolvers';
import { IProjectDocument } from '~/modules/project/@types/project';

export default {
  developerId: async (
    { subdomain }: IProjectDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    const developer = await models.Developer.findOne({ subdomain }).lean();

    return developer?._id;
  },
};
