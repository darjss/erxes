import { DayOfWeek } from '../types/schedule';
import { OneFitDailySchedule } from '../types/schedule';

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
}));

export const GENDER_RESTRICTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'mixed', label: 'Mixed' },
] as const;

export const DAYS_OF_WEEK = Object.values(DayOfWeek).map((day) => ({
  value: day,
  label: day.charAt(0).toUpperCase() + day.slice(1),
}));

export const getDefaultDailySchedule = (): Omit<
  OneFitDailySchedule,
  'activityTypeId'
> => ({
  dayOfWeek: DayOfWeek.MONDAY,
  genderRestriction: 'mixed',
  startTime: '09:00',
  endTime: '17:00',
  dailyLimit: 10,
});

export const getCurrentMonth = () => new Date().getMonth() + 1;

export const getCurrentYear = () => new Date().getFullYear();

export const getNextMonth = () => {
  const nextMonth = getCurrentMonth() + 1;
  return nextMonth > 12 ? 1 : nextMonth;
};
