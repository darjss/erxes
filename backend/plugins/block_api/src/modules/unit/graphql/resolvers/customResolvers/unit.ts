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
  type: async (
    { type }: IUnitDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    return await models.UnitType.findOne({ _id: type });
  },
};
