import { IUnitDocument } from '@/unit/@types/unit';
import { IContext } from '~/connectionResolvers';

export default {
  unitType: async (
    unit: IUnitDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    if (!unit.type) return null;

    return await models.UnitType.findOne({ _id: unit.type });
  },

  unitType: async (
    unit: IUnitDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    if (!unit.type) return null;

    return await models.UnitType.findOne({ _id: unit.type });
  },
};
