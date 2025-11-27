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
      type,
    }: { project?: string; floor?: number; isFeatured?: boolean; type?: string },
    { models }: IContext,
  ) => {
    const projects = await models.Project.find({
      ...(project ? { _id: project } : { isPublished: true }),
    });

    if (!projects.length) return [];

    const buildings = await models.Building.find({
      project: { $in: projects.map((p) => p._id) },
    }).lean();

    if (!buildings.length) return [];

    const zones = await models.Zoning.find({
      building: { $in: buildings.map((b) => b._id) },
      ...(floor ? { floor } : {}),
    }).lean();

    if (!zones.length) return [];

    const filter: any = {
      zoning: { $in: zones.map((z) => z._id) },
    };

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (type) {
      filter.type = type;
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
    const filter = {};

    if (project) {
      filter['project'] = project;
    }

    return models.UnitType.find(filter).lean();
  },
};

markResolvers(cpUnitQueries, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
