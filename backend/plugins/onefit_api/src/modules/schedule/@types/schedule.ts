import { Document } from 'mongoose';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface IDailySchedule {
  dayOfWeek: DayOfWeek;
  activityTypeId: string;
  genderRestriction: string; // 'male', 'female', 'mixed'
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  dailyLimit: number; // Maximum bookings per day
}

export interface IScheduleTemplate {
  providerId: string;
  month: number; // 1-12
  year: number;
  dailySchedules: IDailySchedule[];
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface IScheduleTemplateDocument
  extends Document,
    IScheduleTemplate {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IScheduleException {
  providerId: string;
  date: Date; // Specific date to block
  reason?: string;
  createdAt?: Date;
}

export interface IScheduleExceptionDocument
  extends Document,
    IScheduleException {
  _id: string;
  createdAt: Date;
}

