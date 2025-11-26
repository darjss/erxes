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
  cpBlockAdminGetUnitType: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.UnitType.findOne({ _id }).lean();
  },
  cpBlockAdminGetUnitTypes: async (
    _parent: undefined,
    { project }: { project: string },
    { models }: IContext,
  ) => {
    return models.UnitType.find({ project }).lean();
  },
};

markResolvers(cpUnitQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
