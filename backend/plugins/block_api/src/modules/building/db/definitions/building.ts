import { Schema, Types } from 'mongoose';

export const buildingSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, label: 'Description' },
    project: {
      type: Types.ObjectId,
      required: true,
      ref: 'block_projects',
    },

    startDate: { type: Date, label: 'Start Date' },
    endDate: { type: Date, label: 'End Date' },
  },
  {
    timestamps: true,
  },
);
