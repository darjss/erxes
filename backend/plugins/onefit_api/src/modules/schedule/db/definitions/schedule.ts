import { mongooseStringRandomId } from 'erxes-api-shared/utils';
import { Schema } from 'mongoose';
import { DayOfWeek } from '@/schedule/@types/schedule';

const dailyScheduleSchema = new Schema(
  {
    dayOfWeek: {
      type: String,
      enum: Object.values(DayOfWeek),
      required: true,
      label: 'Day of Week',
    },
    activityTypeId: { type: String, required: true, label: 'Activity Type ID' },
    genderRestriction: {
      type: String,
      required: true,
      label: 'Gender Restriction',
    },
    startTime: { type: String, required: true, label: 'Start Time' }, // HH:mm
    endTime: { type: String, required: true, label: 'End Time' }, // HH:mm
    dailyLimit: { type: Number, required: true, label: 'Daily Limit' },
  },
  { _id: false },
);

export const scheduleTemplateSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    modifiedAt: { type: Date, label: 'Modified at' },
    providerId: { type: String, required: true, label: 'Provider ID' },
    month: { type: Number, required: true, min: 1, max: 12, label: 'Month' },
    year: { type: Number, required: true, label: 'Year' },
    dailySchedules: {
      type: [dailyScheduleSchema],
      required: true,
      label: 'Daily Schedules',
    },
  },
  {
    timestamps: true,
  },
);

export const scheduleExceptionSchema = new Schema(
  {
    _id: mongooseStringRandomId,
    createdAt: { type: Date, label: 'Created at', index: true },
    providerId: { type: String, required: true, label: 'Provider ID' },
    date: { type: Date, required: true, label: 'Blocked Date' },
    reason: { type: String, label: 'Reason' },
  },
  {
    timestamps: true,
  },
);
