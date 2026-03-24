import { IContext } from '~/connectionResolvers';

export const buildingQueries = {
  blockGetBuildings: async (
    _parent: undefined,
    { project },
    { models }: IContext,
  ) => {
    return models.Building.find({ project });
  },
  blockGetBuilding: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Building.findOne({ _id });
  },
};

