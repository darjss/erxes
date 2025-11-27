import { IOffsetPaginateParams } from 'erxes-api-shared/core-types';
import { markResolvers, paginate } from 'erxes-api-shared/utils';
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

      district,
      tenureType,
      priceMin,
      priceMax,
      searchValue,

      page,
      perPage,
      sortField = 'createdAt',
      sortDirection = 'desc',
    }: {
      project?: string;
      floor?: number;
      isFeatured?: boolean;
      type?: string;
      district?: string;
      tenureType?: string;
      priceMin?: number;
      priceMax?: number;
      searchValue?: string;
    } & IOffsetPaginateParams,
    { models }: IContext,
  ) => {
    const projects = await models.Project.find({
      ...(project ? { _id: project } : { isPublished: true }),
      ...(district ? { 'location.district': district } : {}),
    }).lean();

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

    const unitTypeFilter: any = {};

    if (tenureType) {
      unitTypeFilter.tenureType = tenureType;
    }

    if (type) {
      unitTypeFilter._id = type;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      unitTypeFilter.price = {};
      if (priceMin !== undefined) unitTypeFilter.price.$gte = priceMin;
      if (priceMax !== undefined) unitTypeFilter.price.$lte = priceMax;
    }

    if (searchValue) {
      unitTypeFilter.name = { $regex: searchValue, $options: 'i' };
    }

    const unitTypes = await models.UnitType.find(unitTypeFilter).lean();

    if (unitTypes.length) {
      filter.type = { $in: unitTypes.map((ut) => ut._id) };
    }

    return paginate(
      models.Unit.find(filter)
        .sort({ [sortField]: sortDirection })
        .lean(),
      { page, perPage },
    );
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
