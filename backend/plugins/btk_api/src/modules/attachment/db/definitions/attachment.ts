import { Schema } from 'mongoose';

export const btkAttachmentSchema = new Schema(
  {
    itemType: { type: String, required: true },
    itemId: { type: String, required: true },
    attachment: { type: String, required: true },
    order: { type: Number },
  },
  {
    timestamps: true,
  },
);
