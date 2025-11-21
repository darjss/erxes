import { IContext } from '~/connectionResolvers';
import { requireLogin } from 'erxes-api-shared/core-modules';

export const submissionQueries = {
  btkAdminGetSubmission: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Submission.findOne({ _id });
  },

  btkAdminGetSubmissions: async (
    _parent: undefined,
    params: any,
    { models }: IContext,
  ) => {
    return models.Submission.find().lean();
  },
};

requireLogin(submissionQueries, 'btkAdminGetSubmission');
requireLogin(submissionQueries, 'btkAdminGetSubmissions');
