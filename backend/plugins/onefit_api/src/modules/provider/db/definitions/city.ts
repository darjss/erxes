import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const citySchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    name: {
      type: Schema.Types.Mixed,
      required: true,
      label: 'City Name',
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
    code: { type: String, label: 'Code' },
    isActive: { type: Boolean, default: true, label: 'Is Active' },
  },
  {
    timestamps: true,
  },
);

citySchema.index({ isActive: 1 });
citySchema.index({ code: 1 });
