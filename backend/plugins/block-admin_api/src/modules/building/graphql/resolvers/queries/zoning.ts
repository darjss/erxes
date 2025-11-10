import { IContext } from '~/connectionResolvers';

export const zoningQueries = {
  blockGetBuildingZoning: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Zoning.getBuildingZoning(_id);
  },

  blockGetBuildingZonings: async (
    _parent: undefined,
    { building }: { building: string },
    { models }: IContext,
  ) => {
    return models.Zoning.getBuildingZonings(building);
  },
};
