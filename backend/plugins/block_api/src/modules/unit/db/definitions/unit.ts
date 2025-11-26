import { Schema, Types } from 'mongoose';

export const unitSchema = new Schema({
  building: { type: Types.ObjectId, ref: 'block_buildings' },
  zoning: { type: Types.ObjectId, ref: 'block_zonings' },
  number: { type: String },
  leads: { type: [String] },
  status: { type: String },

  type: { type: Types.ObjectId, ref: 'block_unit_types' },
});
