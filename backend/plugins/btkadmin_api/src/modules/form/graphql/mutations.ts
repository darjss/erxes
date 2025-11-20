import { IContext } from '~/connectionResolvers';
import { ISubmission } from '../db/models/Submission';

export const submissionMutation = {
  btkAdminSubmitForm: async (
    _root: undefined,
    { input }: { input: ISubmission },
    { models }: IContext,
  ) => {
    return models.Submission.createSubmission(input);
  },
};
