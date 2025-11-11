import { projectPriceSchema } from '@/project/db/definitions/project';
import { Schema, Types } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const unitSchema = schemaWrapper(
  new Schema({
    building: { type: Types.ObjectId, ref: 'block_buildings' },
    zoning: { type: Types.ObjectId, ref: 'block_zonings' },
    number: { type: String },
    type: { type: String },
    tenureType: { type: String },
    size: { type: Number },
    mainPrice: { type: Number },
    prices: { type: [projectPriceSchema] },
    status: { type: String },
  }),
);
