import { Schema } from 'mongoose';

export const unitTypeSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    size: { type: Number },
    type: { type: String },
    subType: { type: String },
    featureTypes: { type: [String] },
    tenureType: { type: String },
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
);
