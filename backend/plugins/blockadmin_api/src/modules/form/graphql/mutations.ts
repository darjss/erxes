import { Resolver } from 'erxes-api-shared/core-types';
import { DeleteResult } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { ISubmission } from '../@types';

export const submissionMutation: Record<string, Resolver> = {
  blockAdminSubmitForm: async (
    _root: undefined,
    { input }: { input: ISubmission },
    { models, cpUser }: IContext,
  ) => {
    return models.Submission.createSubmission({
      ...input,
      userId: cpUser.erxesCustomerId || cpUser._id,
    });
  },
  blockAdminRemoveSubmissions: async (
    _root: undefined,
    { _ids }: { _ids: string[] },
    { models }: IContext,
  ): Promise<DeleteResult> => {
    return models.Submission.removeSubmissions(_ids);
  },
};

submissionMutation.blockAdminSubmitForm.wrapperConfig = {
  forClientPortal: true,
};
