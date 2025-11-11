import { IContext } from '~/connectionResolvers';

export const zoningQueries = {
  blockGetBuildingZoning: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const zoning = await models.Zoning.findOne({ _id }).lean();

    if (!zoning) {
      throw new Error('Zoning not found');
    }

    return zoning;
  },

  blockGetBuildingZonings: async (
    _parent: undefined,
    { building }: { building: string },
    { models }: IContext,
  ) => {
    return models.Zoning.getBuildingZonings(building);
  },
};
