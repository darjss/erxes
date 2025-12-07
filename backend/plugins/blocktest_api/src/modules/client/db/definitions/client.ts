import { Schema } from 'mongoose';

export const cvClientSchema = new Schema(
  {
    name: { type: String, label: 'Name' },
  },
  {
    timestamps: true,
  },
);
