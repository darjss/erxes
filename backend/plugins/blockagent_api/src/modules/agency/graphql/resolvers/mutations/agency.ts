import { requireLogin } from 'erxes-api-shared/core-modules';
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

  updateAgencyVerificationStatus: async (
    _root: undefined,
    _params: undefined,
    { models }: IContext,
  ) => {
    const existingAgency = await models.BlockAgency.findOne({});

    if (!existingAgency) {
      throw new Error('Agency not found');
    }

    if (existingAgency.verificationStatus === 'pending') {
      throw new Error('Already sent verification request');
    }

    if (existingAgency.verificationStatus === 'verified') {
      throw new Error('Already verified');
    }

    return models.BlockAgency.updateAgencyVerificationStatus(
      existingAgency._id,
      'pending',
    );
  },
};

requireLogin(blockAgencyMutations, 'updateAgencyInfo');
