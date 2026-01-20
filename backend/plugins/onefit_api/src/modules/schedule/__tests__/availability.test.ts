import {
  setupTestDatabase,
  cleanupTestDatabase,
  closeTestDatabase,
  getTestContext,
  createTestProvider,
  createTestActivityType,
  createTestScheduleTemplate,
  createTestScheduleException,
  createTestBooking,
  createTestUserId,
} from './setup';
import { scheduleQueries } from '@/schedule/graphql/resolvers/queries/schedule';
import { DayOfWeek } from '@/schedule/@types/schedule';
import { BookingStatus } from '@/booking/@types/booking';
import { getPureDate } from 'erxes-api-shared/utils';

describe('Availability Calculation Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('Basic Availability', () => {
    it('should return availability for days with schedules', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      expect(availability.year).toBe(2024);
      expect(availability.month).toBe(1);
      expect(availability.days.length).toBeGreaterThan(0);

      // Find Monday (Jan 1, 2024 is a Monday)
      // day.date is normalized, so we need to compare with normalized date
      const mondayDate = new Date(2024, 0, 1); // Jan 1, 2024
      const mondayDatePure = getPureDate(mondayDate);
      const monday = availability.days.find(
        (day) => day.date.getTime() === mondayDatePure.getTime(),
      );
      expect(monday).toBeDefined();
      expect(monday?.hasSchedule).toBe(true);
      expect(monday?.totalSeats).toBe(10);
      expect(monday?.seatsLeft).toBe(10);
      expect(monday?.isFull).toBe(false);
    });

    it('should return full for days without schedules', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      // Find Tuesday (Jan 2, 2024 is a Tuesday)
      // day.date is normalized, so we need to compare with normalized date
      const tuesdayDate = new Date(2024, 0, 2); // Jan 2, 2024
      const tuesdayDatePure = getPureDate(tuesdayDate);
      const tuesday = availability.days.find(
        (day) => day.date.getTime() === tuesdayDatePure.getTime(),
      );
      expect(tuesday).toBeDefined();
      expect(tuesday?.hasSchedule).toBe(false);
      expect(tuesday?.isFull).toBe(true);
      expect(tuesday?.seatsLeft).toBe(0);
      expect(tuesday?.totalSeats).toBe(0);
    });

    it('should return full for month without schedule template', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      expect(availability.days.length).toBeGreaterThan(0);
      availability.days.forEach((day) => {
        expect(day.hasSchedule).toBe(false);
        expect(day.isFull).toBe(true);
        expect(day.seatsLeft).toBe(0);
        expect(day.totalSeats).toBe(0);
      });
    });
  });

  describe('Availability with Exceptions', () => {
    it('should return full for days with exceptions', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const exceptionDate = new Date(2024, 0, 15);
      await createTestScheduleException({
        providerId,
        date: exceptionDate,
        reason: 'Holiday',
        activityTypeId,
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      const exceptionPure = getPureDate(exceptionDate);
      const exceptionDay = availability.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          return day.date.getTime() === exceptionPure.getTime();
        },
      );

      expect(exceptionDay).toBeDefined();
      expect(exceptionDay?.isFull).toBe(true);
      expect(exceptionDay?.seatsLeft).toBe(0);
      expect(exceptionDay?.hasSchedule).toBe(true);
      expect(exceptionDay?.totalSeats).toBe(10);
    });

    it('should handle exceptions without activityTypeId (applies to all)', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const exceptionDate = new Date(2024, 0, 15);
      await createTestScheduleException({
        providerId,
        date: exceptionDate,
        reason: 'Holiday',
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      const exceptionDay = availability.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          const exceptionPure = getPureDate(exceptionDate);
          return day.date.getTime() === exceptionPure.getTime();
        },
      );

      expect(exceptionDay?.isFull).toBe(true);
    });
  });

  describe('Availability with Bookings', () => {
    it('should calculate seats left correctly with bookings', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const bookingDate = new Date(2024, 0, 1);
      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CONFIRMED,
      });

      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CONFIRMED,
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      const bookedDay = availability.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          const bookingPure = getPureDate(bookingDate);
          return day.date.getTime() === bookingPure.getTime();
        },
      );

      expect(bookedDay).toBeDefined();
      expect(bookedDay?.bookedSeats).toBe(2);
      expect(bookedDay?.seatsLeft).toBe(8);
      expect(bookedDay?.isFull).toBe(false);
      expect(bookedDay?.totalSeats).toBe(10);
    });

    it('should mark as full when daily limit is reached', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 2,
          },
        ],
      });

      const bookingDate = new Date(2024, 0, 1);
      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CONFIRMED,
      });

      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CONFIRMED,
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      const bookedDay = availability.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          const bookingPure = getPureDate(bookingDate);
          return day.date.getTime() === bookingPure.getTime();
        },
      );

      expect(bookedDay?.bookedSeats).toBe(2);
      expect(bookedDay?.seatsLeft).toBe(0);
      expect(bookedDay?.isFull).toBe(true);
    });

    it('should not count cancelled bookings', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const bookingDate = new Date(2024, 0, 1);
      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CONFIRMED,
      });

      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CANCELLED,
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      const bookedDay = availability.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          const bookingPure = getPureDate(bookingDate);
          return day.date.getTime() === bookingPure.getTime();
        },
      );

      expect(bookedDay?.bookedSeats).toBe(1);
      expect(bookedDay?.seatsLeft).toBe(9);
    });
  });

  describe('lastDays Parameter', () => {
    it('should filter days by lastDays parameter', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
          {
            dayOfWeek: DayOfWeek.TUESDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          lastDays: 7,
        },
        context,
      );

      const now = new Date();
      const startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      availability.days.forEach((day) => {
        expect(day.date >= startDate).toBe(true);
        expect(day.date <= endDate).toBe(true);
      });
    });
  });

  describe('Multiple Activity Types', () => {
    it('should calculate availability separately for different activity types', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId1 = await createTestActivityType({ providerId });
      const activityTypeId2 = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId: activityTypeId1,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId: activityTypeId2,
            genderRestriction: 'mixed',
            startTime: '14:00',
            endTime: '15:00',
            dailyLimit: 5,
          },
        ],
      });

      const bookingDate = new Date(2024, 0, 1);
      await createTestBooking({
        userId: createTestUserId(),
        providerId,
        activityTypeId: activityTypeId1,
        bookingDate,
        startTime: '09:00',
        endTime: '10:00',
        status: BookingStatus.CONFIRMED,
      });

      const availability1 = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId: activityTypeId1,
          year: 2024,
          month: 1,
        },
        context,
      );

      const availability2 = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId: activityTypeId2,
          year: 2024,
          month: 1,
        },
        context,
      );

      const day1 = availability1.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          const bookingPure = getPureDate(bookingDate);
          return day.date.getTime() === bookingPure.getTime();
        },
      );
      const day2 = availability2.days.find(
        (day) => {
          // day.date is already normalized (currentDatePure), so compare directly
          const bookingPure = getPureDate(bookingDate);
          return day.date.getTime() === bookingPure.getTime();
        },
      );

      expect(day1?.bookedSeats).toBe(1);
      expect(day1?.totalSeats).toBe(10);
      expect(day2?.bookedSeats).toBe(0);
      expect(day2?.totalSeats).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle month with no matching daily schedules', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 1,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const differentActivityTypeId = await createTestActivityType({ providerId });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId: differentActivityTypeId,
          year: 2024,
          month: 1,
        },
        context,
      );

      availability.days.forEach((day) => {
        expect(day.hasSchedule).toBe(false);
        expect(day.isFull).toBe(true);
      });
    });

    it('should handle leap year February correctly', async () => {
      const context = getTestContext();
      const providerId = await createTestProvider();
      const activityTypeId = await createTestActivityType({ providerId });

      await createTestScheduleTemplate({
        providerId,
        month: 2,
        year: 2024,
        dailySchedules: [
          {
            dayOfWeek: DayOfWeek.MONDAY,
            activityTypeId,
            genderRestriction: 'mixed',
            startTime: '09:00',
            endTime: '10:00',
            dailyLimit: 10,
          },
        ],
      });

      const availability = await scheduleQueries.oneFitMonthAvailability(
        undefined,
        {
          providerId,
          activityTypeId,
          year: 2024,
          month: 2,
        },
        context,
      );

      expect(availability.days.length).toBe(29);
    });
  });
});
