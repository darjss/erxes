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
    return models.Status.getStatus(_id);
  },

  getBlockOpptyStatuses: async (
    _root: undefined,
    { projectId }: { projectId: string },
    { models }: IContext,
  ) => {
    return await models.Status.getStatuses(projectId)
  },

  getBlockOpptyStatusTypes: async () => {
    return Object.values(DEFAULT_STATUS_TYPES).map((type) => ({
      ...DEFAULT_STATUS_TYPE_VALUES[type],
      type,
    }));
  },
};
