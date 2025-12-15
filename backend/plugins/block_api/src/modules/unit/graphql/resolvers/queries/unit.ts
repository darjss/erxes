import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const unitQueries = {
  blockGetUnit: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.findOne({ _id }).populate('building');
  },

  blockGetUnits: async (
    _root,
    { zoning, zonings }: { zoning: string; zonings: string[] },
    { models }: IContext,
  ) => {
    if (zonings?.length) {
      return models.Unit.find({ zoning: { $in: zonings } }).lean();
    }

    return models.Unit.getUnitsByZoning(zoning);
  },
};

requireLogin(unitQueries, 'blockGetUnit');
requireLogin(unitQueries, 'blockGetUnits');
