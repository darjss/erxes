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
    name: {
      type: Schema.Types.Mixed,
      required: true,
      label: 'Activity Type Name',
      validate: {
        validator: function (v: any) {
          return (
            v &&
            typeof v === 'object' &&
            typeof v.en === 'string' &&
            typeof v.mn === 'string' &&
            v.en !== undefined &&
            v.mn !== undefined
          );
        },
        message: 'Name must have both en and mn properties as strings',
      },
    },
    description: {
      type: Schema.Types.Mixed,
      label: 'Description',
      validate: {
        validator: function (v: any) {
          if (!v) return true;
          return (
            typeof v === 'object' &&
            (typeof v.en === 'string' || typeof v.mn === 'string')
          );
        },
        message: 'Description must be an object with en and/or mn properties',
      },
    },
    creditCost: { type: Number, required: true, label: 'Credit Cost' },
    price: { type: Number, label: 'Price', default: 0 },
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
    singlePersonLimit: {
      type: Number,
      label: 'Single Person Limit',
      default: 5,
    },
    image: { type: String, label: 'Image URL', optional: true },
  },
  {
    timestamps: true,
  },
);

activityTypeSchema.index({ categoryIds: 1 });
activityTypeSchema.index({ providerId: 1 });
