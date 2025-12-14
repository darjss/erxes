import { Schema } from 'mongoose';
import { ICVRiskGroupDocument } from '@/risk/@types/riskGroup';

export const riskGroupSchema = new Schema<ICVRiskGroupDocument>(
  {
    name: { type: String, required: true },
    client: { type: String, required: true },
    effective_date: { type: Date, required: true },
    expiration_date: { type: Date, required: true },
  },
  { timestamps: true },
);
