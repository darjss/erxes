import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';

export const systemConfigSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },

    key: { type: String, required: true, unique: true, label: 'Config Key' },
    value: { type: Schema.Types.Mixed, required: true, label: 'Config Value' },
    description: { type: String, label: 'Description' },
  },
  {
    timestamps: true,
  },
);


