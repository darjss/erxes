import { Schema, Types } from 'mongoose';
import { schemaWrapper } from '~/utils';

export const unitLeadSchema = schemaWrapper(
  new Schema({
    leadType: { type: String, required: true },
    leadId: { type: Types.ObjectId, required: true },
    unit: { type: Types.ObjectId, required: true, ref: 'block_units' },
  }),
);
