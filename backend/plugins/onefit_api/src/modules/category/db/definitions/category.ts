import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const activityCategorySchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    name: { type: String, required: true, label: 'Category Name' }, // 'Kids' or 'Adults'
    description: { type: String, label: 'Description' },
    parentId: { type: String, label: 'Parent Category ID' },
    isActive: { type: Boolean, default: true, label: 'Is Active' },
  },
  {
    timestamps: true,
  },
);

activityCategorySchema.index({ name: 1 }, { unique: true });
activityCategorySchema.index({ parentId: 1 });

