import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const districtSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    cityId: { type: String, required: true, label: 'City ID', index: true },
    name: {
      type: Schema.Types.Mixed,
      required: true,
      label: 'District Name',
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

districtSchema.index({ cityId: 1, isActive: 1 });
districtSchema.index({ isActive: 1 });
