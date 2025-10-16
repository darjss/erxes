import { Schema } from 'mongoose';
import { IBlockDeveloperDocument } from '@/developer/db/@types/developer';

export const developerSchema = new Schema<IBlockDeveloperDocument>(
  {
    name: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: Object },
    dateFounded: { type: Date },
  },
  { timestamps: true },
);
