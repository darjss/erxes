import { ISubmission, ISubmissionDocument } from '@/form/@types';
import { DeleteResult, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { submissionSchema } from '../definitions/submission';

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  createSubmission(input: ISubmission): Promise<ISubmissionDocument>;
  removeSubmissions(_ids: string[]): Promise<DeleteResult>;
}

export const loadSubmissionClass = (models: IModels) => {
  class Submission {
    public static async createSubmission(input: ISubmission) {
      return models.Submission.create(input);
    }

    public static async removeSubmissions(_ids: string[]) {
      return models.Submission.deleteMany({ _id: { $in: _ids } });
    }
  }

  submissionSchema.loadClass(Submission);

  return submissionSchema;
};
