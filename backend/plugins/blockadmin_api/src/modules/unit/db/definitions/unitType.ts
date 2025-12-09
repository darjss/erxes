import { Schema } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const unitTypeSchema = schemaWrapper(
  new Schema(
    {
      name: { type: String },
      description: { type: String },
      size: { type: Number },
      type: { type: String },
      subTypes: { type: [String] },
      featureTypes: { type: [String] },
      areaType: { type: String },
      tenureTypes: { type: [String] },
      content: { type: String },
      price: { type: Number },
      prices: { type: Schema.Types.Mixed },
      status: { type: String },
      rooms: { type: Schema.Types.Mixed },
      roomsCount: { type: Number },
      project: { type: Schema.Types.ObjectId, ref: 'block_projects' },

      coverImage: { type: String },
      images: { type: [String] },
      planImages: { type: [String] },
    },
    {
      timestamps: true,
    },
  ),
);
