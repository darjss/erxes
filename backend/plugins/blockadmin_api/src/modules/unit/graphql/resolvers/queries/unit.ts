import { IContext } from '~/connectionResolvers';

export const unitQueries = {
  blockAdminGetUnit: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.findOne({ _id }).populate('building');
  },

  blockAdminGetUnits: async (
    _root,
    { zoning }: { zoning: string },
    { models }: IContext,
  ) => {
    return models.Unit.getUnitsByZoning(zoning);
  },
};
