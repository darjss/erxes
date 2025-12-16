import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const activityCategorySchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    name: {
      type: Schema.Types.Mixed,
      required: true,
      label: 'Category Name',
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
    parentId: { type: String, label: 'Parent Category ID' },
    isActive: { type: Boolean, default: true, label: 'Is Active' },
    image: { type: String, label: 'Image URL', optional: true },
    icon: { type: String, label: 'Icon URL', optional: true },
  },
  {
    timestamps: true,
  },
);

activityCategorySchema.index({ 'name.en': 1, 'name.mn': 1 });
activityCategorySchema.index({ parentId: 1 });
