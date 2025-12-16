import { Schema, Types } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const unitSchema = schemaWrapper(
  new Schema(
    {
      building: { type: Types.ObjectId, ref: 'block_buildings' },
      zoning: { type: Types.ObjectId, ref: 'block_zonings' },
      number: { type: String },
      leads: { type: [String] },
      status: { type: String },

      type: { type: Types.ObjectId, ref: 'block_unit_types' },
      isFeatured: { type: Boolean },
    },
    {
      timestamps: true,
    },
  ),
);
