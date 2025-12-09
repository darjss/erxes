import { z } from 'zod';
import { DayOfWeek } from '../types/schedule';

export const dailyScheduleSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  activityTypeId: z
    .string()
    .min(1, { message: 'Activity Type ID is required' }),
  genderRestriction: z
    .string()
    .min(1, { message: 'Gender restriction is required' }),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format',
  }),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format',
  }),
  dailyLimit: z.number().min(1, { message: 'Daily limit must be at least 1' }),
});

export const createScheduleTemplateSchema = z.object({
  providerId: z.string().min(1, { message: 'Provider ID is required' }),
  month: z
    .number()
    .min(1)
    .max(12, { message: 'Month must be between 1 and 12' }),
  year: z.number().min(2000, { message: 'Year must be 2000 or later' }),
  dailySchedules: z.array(dailyScheduleSchema).min(1, {
    message: 'At least one daily schedule is required',
  }),
});

export const editScheduleTemplateSchema = z.object({
  dailySchedules: z.array(dailyScheduleSchema).min(1, {
    message: 'At least one daily schedule is required',
  }),
});

export const createScheduleExceptionSchema = z.object({
  providerId: z.string().min(1, { message: 'Provider ID is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
  reason: z.string().optional(),
});

export const copyPreviousMonthSchema = z.object({
  providerIds: z
    .array(z.string())
    .min(1, { message: 'At least one provider is required' }),
  fromYear: z.number().min(2000, { message: 'Year must be 2000 or later' }),
  fromMonth: z
    .number()
    .min(1)
    .max(12, { message: 'Month must be between 1 and 12' }),
  toYear: z.number().min(2000, { message: 'Year must be 2000 or later' }),
  toMonth: z
    .number()
    .min(1)
    .max(12, { message: 'Month must be between 1 and 12' }),
});
