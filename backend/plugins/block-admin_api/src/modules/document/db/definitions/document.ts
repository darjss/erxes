import { DOCUMENT_VISIBILITIES } from '@/document/constants/visiblities';
import { Schema, Types } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const documentSchema = schemaWrapper(
  new Schema(
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      itemType: { type: String, required: true },
      itemId: {
        type: Types.ObjectId,
        required: true,
      },
      visibility: {
        type: String,
        required: true,
        enum: DOCUMENT_VISIBILITIES.ALL,
      },
      createdBy: { type: String, required: true },
      attachment: { type: String, required: true },
      description: { type: String, required: true },
    },
    {
      timestamps: true,
    },
  ),
);
