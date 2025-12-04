import { IUnitDocument } from '@/unit/@types/unit';
import { IContext } from '~/connectionResolvers';

export default {
  buildingData: async (
    unit: IUnitDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    return await models.Building.findOne({ _id: unit.building });
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
