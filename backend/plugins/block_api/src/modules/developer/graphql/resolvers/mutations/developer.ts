import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';
import { IContext } from '~/connectionResolvers';

export const developerMutations = {
  updateDeveloperInfo: async (
    _root: undefined,
    { input }: { input: IBlockDeveloperDocument },
    { models, user }: IContext,
  ) => {
    const existingDeveloper = await models.Developer.findOne({});

    if (!existingDeveloper) {
      return models.Developer.createDeveloper(input);
    }


    return models.Developer.updateDeveloper(existingDeveloper._id, input, user._id);
  },
  
  updateDeveloperVerificationStatus: async (
    _root: undefined,
    _params: undefined,
    { models }: IContext,
  ) => {
    const existingDeveloper = await models.Developer.findOne({});

    if (!existingDeveloper) {
      throw new Error('Developer not found');
    }

    if (existingDeveloper.verificationStatus === 'pending') {
      throw new Error('Already sent verification request');
    }

    if (existingDeveloper.verificationStatus === 'verified') {
      throw new Error('Already verified');
    }

    return models.Developer.updateDeveloperVerificationStatus(
      existingDeveloper._id,
      'pending',
    );
  },
};

