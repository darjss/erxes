import { IContext } from '~/connectionResolvers';
import { IBlockAgency } from '~/modules/agency/@types/agency';

export const blockAgencyMutations = {
  updateAgencyInfo: async (
    _root: undefined,
    { input }: { input: IBlockAgency },
    { models }: IContext,
  ) => {
    const existingAgency = await models.BlockAgency.findOne({});

    if (!existingAgency) {
      return models.BlockAgency.createAgency(input);
    }

    return models.BlockAgency.updateAgency(existingAgency._id, input);
  },
};
