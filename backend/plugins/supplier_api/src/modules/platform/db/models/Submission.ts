import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { submissionSchema } from '@/platform/db/definitions/submission';
import {
  ISubmissionDocument,
  ISubmissionOffering,
  SubmissionPlatform,
} from '@/platform/@types/submission';

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  submitProduct(
    platform: SubmissionPlatform,
    productId: string,
    offering?: ISubmissionOffering,
  ): Promise<ISubmissionDocument>;
  receiveDecision(
    platform: SubmissionPlatform,
    productId: string,
    status: string,
    note?: string,
  ): Promise<ISubmissionDocument | null>;
  receiveProductUpdate(
    productId: string,
    action: 'update' | 'delete',
  ): Promise<void>;
}

export const loadSubmissionClass = (models: IModels) => {
  class Submission {
    public static async submitProduct(
      platform: SubmissionPlatform,
      productId: string,
      offering: ISubmissionOffering = {},
    ) {
      return models.Submission.findOneAndUpdate(
        { platform, productId },
        {
          $set: {
            status: 'submitted',
            note: null,
            offering,
            submittedAt: new Date(),
          },
          $setOnInsert: { platform, productId },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    public static async receiveDecision(
      platform: SubmissionPlatform,
      productId: string,
      status: string,
      note?: string,
    ) {
      return models.Submission.findOneAndUpdate(
        { platform, productId },
        {
          $set: {
            status,
            decidedAt: new Date(),
            ...(note !== undefined ? { note } : {}),
          },
        },
        { new: true },
      );
    }

    public static async receiveProductUpdate(
      productId: string,
      action: 'update' | 'delete',
    ) {
      if (action === 'delete') {
        await models.Submission.deleteMany({ productId });
      }
    }
  }

  submissionSchema.loadClass(Submission);

  return submissionSchema;
};
