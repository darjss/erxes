import { Schema, Types } from 'mongoose';

export const unitLeadSchema = new Schema({
  leadType: { type: String, required: true },
  leadId: { type: Types.ObjectId, required: true },
  unit: { type: Types.ObjectId, required: true, ref: 'block_units' },
});
