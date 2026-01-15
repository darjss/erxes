import { IContext } from '~/connectionResolvers';

export const statusQueries = {
  getBlockStatus: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Status.getStatus(_id);
  },

  getBlockStatuses: async (
    _root: undefined,
    { projectId, type }: { projectId: string; type?: string },
    { models }: IContext,
  ) => {
    return models.Status.getStatuses(projectId, type);
  },
};
