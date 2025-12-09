import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { GenderRestriction } from '@/activity-type/@types/activityType';

export const activityTypeSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    providerId: {
      type: String,
      required: true,
      label: 'Provider ID',
      index: true,
    },
    name: { type: String, required: true, label: 'Activity Type Name' },
    description: { type: String, label: 'Description' },
    creditCost: { type: Number, required: true, label: 'Credit Cost' },
    duration: { type: Number, required: true, label: 'Duration (minutes)' },
    genderRestriction: {
      type: String,
      enum: Object.values(GenderRestriction),
      required: true,
      default: GenderRestriction.MIXED,
      label: 'Gender Restriction',
    },
    categoryIds: { type: [String], required: true, label: 'Category IDs' },
    isActive: { type: Boolean, default: true, label: 'Is Active' },
    cancellationDeadline: {
      type: Number,
      label: 'Cancellation Deadline (hours)',
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

activityTypeSchema.index({ categoryIds: 1 });
activityTypeSchema.index({ providerId: 1 });
