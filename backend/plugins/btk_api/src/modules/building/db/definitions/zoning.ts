import { Schema, Types } from 'mongoose';

export const zoningSchema = new Schema({
  building: { type: Types.ObjectId, ref: 'btk_buildings' },
  floor: { type: Number },
  usageType: { type: String },
  tenureType: { type: String },
  size: { type: Number },
});
