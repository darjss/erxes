import { markResolvers } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ISubmission } from '../@types';

export const submissionMutation = {
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
};

markResolvers(submissionMutation, {
  wrapperConfig: {
    forClientPortal: true,
  },
});
