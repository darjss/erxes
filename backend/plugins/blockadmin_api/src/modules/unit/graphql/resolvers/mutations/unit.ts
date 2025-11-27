import { IContext } from '~/connectionResolvers';
import { IUnit } from '~/modules/unit/@types/unit';

export const unitMutations = {
  blockAdminUpdateUnit: async (
    _parent: undefined,
    { _id, input }: { _id: string; input: IUnit },
    { models }: IContext,
  ) => {
    return await models.Unit.findOneAndUpdate({ _id }, input, { new: true });
  },
};
