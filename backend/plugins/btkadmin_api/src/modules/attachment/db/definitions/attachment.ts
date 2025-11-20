import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const btkAttachmentSchema = schemaWrapper(
  new Schema(
    {
      itemType: { type: String, required: true },
      itemId: { type: String, required: true },
      attachment: { type: String, required: true },
      order: { type: Number },
    },
    {
      timestamps: true,
    },
  ),
);
