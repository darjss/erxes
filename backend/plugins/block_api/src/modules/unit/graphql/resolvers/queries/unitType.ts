import { IContext } from '~/connectionResolvers';

export const unitTypesQueries = {
  blockGetUnitTypes: async (
    _parent: undefined,
    _args: undefined,
    { models }: IContext,
  ) => {
    return models.UnitType.find().lean();
  },

  blockGetUnitType: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.UnitType.findOne({ _id }).lean();
  },
};
