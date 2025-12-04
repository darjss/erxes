import { IContext } from '~/connectionResolvers';

export const unitTypesQueries = {
  blockGetUnitTypes: async (
    _parent: undefined,
    { project }: { project: string },
    { models }: IContext,
  ) => {
    return models.UnitType.find({ project }).sort({ name: 'asc' }).lean();
  },

  blockGetUnitType: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.UnitType.findOne({ _id }).lean();
  },
};
