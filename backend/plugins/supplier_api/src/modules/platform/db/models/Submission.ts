import { Model } from 'mongoose';
import { EventDispatcherReturn } from 'erxes-api-shared/core-modules';
import { IModels } from '~/connectionResolvers';
import { submissionSchema } from '@/platform/db/definitions/submission';
import {
  ISubmissionDocument,
  ISubmissionOffering,
  SubmissionPlatform,
} from '@/platform/@types/submission';
import {
  buildSubmissionSubmittedLog,
  buildSubmissionResubmittedLog,
  buildSubmissionDecisionLog,
} from '~/meta/activity-log/submission';

export interface ISubmissionModel extends Model<ISubmissionDocument> {
  submitProduct(
    platform: SubmissionPlatform,
    productId: string,
    offering?: ISubmissionOffering,
  ): Promise<ISubmissionDocument>;
  resubmitProduct(
    platform: SubmissionPlatform,
    productId: string,
    offering?: ISubmissionOffering,
  ): Promise<ISubmissionDocument | null>;
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

export const loadSubmissionClass = (
  models: IModels,
  { createActivityLog }: EventDispatcherReturn,
) => {
  class Submission {
    public static async submitProduct(
      platform: SubmissionPlatform,
      productId: string,
      offering: ISubmissionOffering = {},
    ) {
      const submission = await models.Submission.findOneAndUpdate(
        { platform, productId },
        {
          $set: { status: 'submitted', note: null, offering, submittedAt: new Date() },
          $setOnInsert: { platform, productId },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      if (submission) {
        createActivityLog(buildSubmissionSubmittedLog(submission));
      }

      return submission;
    }

    public static async resubmitProduct(
      platform: SubmissionPlatform,
      productId: string,
      offering: ISubmissionOffering = {},
    ) {
      const submission = await models.Submission.findOneAndUpdate(
        { platform, productId },
        { $set: { status: 'pending', note: null, offering, submittedAt: new Date() } },
        { new: true },
      );

      if (submission) {
        createActivityLog(buildSubmissionResubmittedLog(submission));
      }

      return submission;
    }

    public static async receiveDecision(
      platform: SubmissionPlatform,
      productId: string,
      status: string,
      note?: string,
    ) {
      const submission = await models.Submission.findOneAndUpdate(
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

      if (submission) {
        createActivityLog(buildSubmissionDecisionLog(submission, status, note));
      }

      return submission;
    }

    public static async receiveProductUpdate(
      productId: string,
      action: 'update' | 'delete',
    ) {
      if (action === 'delete') {
        await models.Submission.deleteMany({ productId });
        return;
      }

      if (action === 'update') {
        await models.Submission.updateMany(
          { productId },
          { $set: { updatedAt: new Date() } },
        );
      }
    }
  }

  submissionSchema.loadClass(Submission);

  return submissionSchema;
};
