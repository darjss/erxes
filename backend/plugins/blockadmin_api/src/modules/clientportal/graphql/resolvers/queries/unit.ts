import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

export const cpUnitQueries = {
  cpBlockAdminGetUnit: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Unit.findOne({ _id }).lean();
  },
  cpBlockAdminGetUnits: async (
    _parent: undefined,
    { zoning }: { zoning: string },
    { models }: IContext,
  ) => {
    return models.Unit.getUnitsByZoning(zoning);
  },
};

markResolvers(cpUnitQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
