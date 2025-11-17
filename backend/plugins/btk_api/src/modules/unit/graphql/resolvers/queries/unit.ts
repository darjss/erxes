import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const unitQueries = {
  btkGetUnit: async (_root, { _id }: { _id: string }, { models }: IContext) => {
    return models.Unit.findOne({ _id }).populate('building');
  },

  btkGetUnits: async (
    _root,
    { zoning }: { zoning: string },
    { models }: IContext,
  ) => {
    return models.Unit.getUnitsByZoning(zoning);
  },
};

requireLogin(unitQueries, 'btkGetUnit');
requireLogin(unitQueries, 'btkGetUnits');
