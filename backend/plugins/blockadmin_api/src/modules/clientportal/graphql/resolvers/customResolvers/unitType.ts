import { IUnitTypeDocument } from '@/unit/@types/unitType';
import { IContext } from '~/connectionResolvers';

export default {
  unitsCount: async (
    { _id }: IUnitTypeDocument,
    _args: undefined,
    { models }: IContext,
  ) => {
    return await models.Unit.countDocuments({ type: _id });
  },
};
