import { IContext } from '~/connectionResolvers';

export const buildingQueries = {
  blockAdminGetBuildings: async (
    _parent: undefined,
    { project },
    { models }: IContext,
  ) => {
    return models.Building.find({ project });
  },
  blockAdminGetBuilding: async (
    _parent: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Building.findOne({ _id });
  },
};
