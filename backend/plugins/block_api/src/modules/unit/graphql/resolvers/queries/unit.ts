import { requireLogin } from 'erxes-api-shared/core-modules';
import { IContext } from '~/connectionResolvers';

export const unitQueries = {
  blockGetUnit: async (
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.findOne({ _id }).populate('building');
  },

  blockGetUnits: async (
    _root: undefined,
    { zoning, zonings }: { zoning: string; zonings: string[] },
    { models }: IContext,
  ) => {
    if (zonings?.length) {
      return models.Unit.find({ zoning: { $in: zonings } });
    }

    return models.Unit.getUnitsByZoning(zoning);
  },
};

requireLogin(unitQueries, 'blockGetUnit');
requireLogin(unitQueries, 'blockGetUnits');
