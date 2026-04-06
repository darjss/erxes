import {
  DEFAULT_STATUS_TYPE_VALUES,
  DEFAULT_STATUS_TYPES,
} from '@/oppty/constants';
import { IContext } from '~/connectionResolvers';

export const statusQueries = {
  getBlockOpptyStatus: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.OpptyStatus.getOpptyStatus(_id);
  },

  getBlockOpptyStatuses: async (
    _root: undefined,
    { projectId }: { projectId: string },
    { models }: IContext,
  ) => {
    const statuses = await Promise.all(
      Object.values(DEFAULT_STATUS_TYPES).map((type) =>
        models.OpptyStatus.getOpptyStatuses(projectId, type),
      ),
    );

    return statuses.flat().map(({ name, _id, color, type, order, projectId }) => ({
      _id,
      name,
      color,
      type,
      order,
      projectId
    }));
  },

  getBlockOpptyStatusTypes: async () => {
    return Object.values(DEFAULT_STATUS_TYPES).map((type) => DEFAULT_STATUS_TYPE_VALUES[type]);
  },
};
