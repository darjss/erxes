import { IContext } from '~/connectionResolvers';
import { IUnitType } from '~/modules/unit/@types/unitType';

export const unitTypesMutations = {
  createUnitType: async (
    _parent: undefined,
    _args: { input: IUnitType },
    { models }: IContext,
  ) => {
    return models.UnitType.create(_args.input);
  },

  updateUnitType: async (
    _parent: undefined,
    _args: { _id: string; input: IUnitType },
    { models }: IContext,
  ) => {
    return models.UnitType.findOneAndUpdate({ _id: _args._id }, _args.input, {
      new: true,
    });
  },
};
