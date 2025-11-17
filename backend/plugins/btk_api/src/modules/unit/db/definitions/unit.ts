import { Schema, Types } from 'mongoose';
import { projectPriceSchema } from '@/project/db/definitions/project';

export const unitSchema = new Schema({
  building: { type: Types.ObjectId, ref: 'btk_buildings' },
  zoning: { type: Types.ObjectId, ref: 'btk_zonings' },
  number: { type: String },
  type: { type: String },
  tenureType: { type: String },
  size: { type: Number },
  mainPrice: { type: Number },
  prices: { type: [projectPriceSchema] },
  status: { type: String },
});
