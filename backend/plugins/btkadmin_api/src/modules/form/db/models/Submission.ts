import { Document, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { submissionSchema } from '../definitions/submission';

export interface ISubmission {
  userId: string;
  form: number;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
}

export interface ISubmissionDocument extends ISubmission, Document {
  submittedAt: Date;
}

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
