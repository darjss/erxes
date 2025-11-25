import { ISubmission, ISubmissionDocument } from '@/form/@types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { submissionSchema } from '../definitions/submission';

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  createSubmission(input: ISubmission): Promise<ISubmissionDocument>;
}

export const loadSubmissionClass = (models: IModels) => {
  class Submission {
    public static async createSubmission(input: ISubmission) {
      return models.Submission.create(input);
    }
  }

  submissionSchema.loadClass(Submission);

  return submissionSchema;
};
