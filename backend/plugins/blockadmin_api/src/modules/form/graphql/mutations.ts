import { IContext } from '~/connectionResolvers';
import { ISubmission } from '../db/models/Submission';

export const submissionMutation = {
  blockAdminSubmitForm: async (
    _root: undefined,
    { input }: { input: ISubmission },
    { models }: IContext,
  ) => {
    console.log('input', input);
    return models.Submission.createSubmission(input);
  },
};
