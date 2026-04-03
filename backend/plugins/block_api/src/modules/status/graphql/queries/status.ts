import { DEFAULT_STATUS_TYPES } from '@/status/constants';
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
    { projectId }: { projectId: string },
    { models }: IContext,
  ) => {
    const statuses = await Promise.all(
      Object.values(DEFAULT_STATUS_TYPES).map((type) =>
        models.Status.getStatuses(projectId, type),
      ),
    );

    return statuses.flat();
  },

  getBlockStatusTypes: async (
    _root: undefined,
    { projectId }: { projectId: string },
    { models }: IContext,
  ) => {
    return models.Status.getStatusTypes(projectId);
  },
};
