import { IContext } from '~/connectionResolvers';
import { IUnitType } from '~/modules/unit/@types/unitType';

export const unitTypesMutations = {
  blockCreateUnitType: async (
    _parent: undefined,
    { input }: { input: IUnitType },
    { models }: IContext,
  ) => {
    return models.UnitType.create(input);
  },

  blockUpdateUnitType: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IUnitType },
    { models, user }: IContext,
  ) => {
    return models.UnitType.updateUnitType(_id, input, user?._id || '');
  },
};
