import { Schema, Types } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const zoningSchema = schemaWrapper(
  new Schema({
    building: { type: Types.ObjectId, ref: 'block_buildings' },
    floor: { type: Number },
    usageType: { type: String },
    tenureType: { type: String },
    size: { type: Number },
  }),
);
