import { Schema, Types } from 'mongoose';
import { BLOCK_BUILDING_STATUS } from '@/building/constants';

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
    coverImage: { type: String, label: 'Cover Image' },

    status: {
      type: String,
      label: 'Status',
      enum: BLOCK_BUILDING_STATUS.ALL,
      default: BLOCK_BUILDING_STATUS.PLANNED,
    },

    startDate: { type: Date, label: 'Start Date' },
    endDate: { type: Date, label: 'End Date' },
  },
  {
    timestamps: true,
  },
);
