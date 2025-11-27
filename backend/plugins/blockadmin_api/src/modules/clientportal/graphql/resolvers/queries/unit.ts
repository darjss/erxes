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
    {
      project,
      floor,
      isFeatured,
    }: { project?: string; floor?: number; isFeatured?: boolean },
    { models }: IContext,
  ) => {
    const filter = {};

    const buildings = await models.Building.find({ project }).lean();

    const zones = await models.Zoning.find({
      building: { $in: (buildings || []).map((building) => building._id) },
      ...(floor ? { floor } : {}),
    }).lean();

    if (zones?.length) {
      filter['zoning'] = { $in: zones.map((zone) => zone._id) };
    }

    if (isFeatured) {
      filter['isFeatured'] = isFeatured;
    }

    return models.Unit.find(filter).lean();
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
