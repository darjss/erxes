import { Schema, Types } from 'mongoose';

export const zoningSchema = new Schema({
  building: { type: Types.ObjectId, ref: 'block_buildings' },
  floor: { type: Number },
  usageType: { type: String },
  tenureType: { type: String },
  size: { type: Number },
});
