import { IContext } from '~/connectionResolvers';

export const zoningQueries = {
  btkGetBuildingZoning: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Zoning.getBuildingZoning(_id);
  },

  btkGetBuildingZonings: async (
    _parent: undefined,
    { building }: { building: string },
    { models }: IContext,
  ) => {
    return models.Zoning.getBuildingZonings(building);
  },
};
