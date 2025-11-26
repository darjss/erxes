import { IContext } from '~/connectionResolvers';

export const unitTypesQueries = {
  blockAdminGetUnitTypes: async (
    _parent: undefined,
    { project }: { project: string },
    { models }: IContext,
  ) => {
    return models.UnitType.find({ project }).lean();
  },

  blockAdminGetUnitType: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.UnitType.findOne({ _id }).lean();
  },
};
