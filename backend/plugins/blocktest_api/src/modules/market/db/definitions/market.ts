import { Schema } from 'mongoose';

export const cvMarketSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
  },
  {
    timestamps: true,
  },
);
