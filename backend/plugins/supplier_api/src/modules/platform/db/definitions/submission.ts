import { Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { ISubmissionDocument } from '@/platform/@types/submission';

export const SUBMISSION_PLATFORMS = {
  MUSHOP: 'mushop',
  BLOCKADMIN: 'blockadmin',
  ALL: ['mushop', 'blockadmin'],
};

export const PLATFORM_SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESUBMITTED: 'resubmitted',
  ALL: ['submitted', 'approved', 'rejected', 'resubmitted'],
};

export const submissionSchema = new Schema<ISubmissionDocument>(
  {
    _id: mongooseStringRandomId,
    platform: {
      type: String,
      enum: SUBMISSION_PLATFORMS.ALL,
      required: true,
      index: true,
    },
    productId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: PLATFORM_SUBMISSION_STATUS.ALL,
      default: PLATFORM_SUBMISSION_STATUS.SUBMITTED,
    },
    note: { type: String },
    offering: {
      price: { type: Number },
      stock: { type: Number },
      minBuyCount: { type: Number },
      maxBuyCount: { type: Number },
      groupBuyMinCount: { type: Number },
      groupBuyDiscount: { type: Number },
      warrantyDuration: { type: Number },
    },
    submittedAt: { type: Date, default: Date.now },
    decidedAt: { type: Date },
  },
  { timestamps: true },
);

// one submission per product per supplier per platform
submissionSchema.index({ platform: 1, productId: 1 }, { unique: true });
