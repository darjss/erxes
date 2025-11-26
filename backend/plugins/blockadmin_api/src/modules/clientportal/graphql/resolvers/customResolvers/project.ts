import { IContext } from '~/connectionResolvers';

export default {
  projectsCounts: async (
    { _id }: { _id: string },
    _args: undefined,
    { models }: IContext,
  ) => {
    return await models.Project.countDocuments({ developer: _id });
  },
};
