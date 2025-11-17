import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const buildingQueries = {
  btkGetBuildings: async (
    _parent: undefined,
    { project },
    { models }: IContext,
  ) => {
    return models.Building.find({ project });
  },
  btkGetBuilding: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Building.findOne({ _id });
  },
};

requireLogin(buildingQueries, 'btkGetBuildings');
requireLogin(buildingQueries, 'btkGetBuilding');
