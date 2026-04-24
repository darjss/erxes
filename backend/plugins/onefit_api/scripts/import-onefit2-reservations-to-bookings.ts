/**
 * Import Onefit2 reservations into local bookings (reservation-only flow).
 *
 * Prerequisites:
 * - OneFit customers must exist (run import-onefit2-users.ts first).
 * - Activity types and providers must exist in local DB.
 *
 * Environment:
 * - ONEFIT2_MONGO_URL: Onefit2 MongoDB (Reservation, Activity, Checkin source)
 * - MONGO_URL: local erxes MongoDB
 *
 * Usage:
 *   ONEFIT2_MONGO_URL=... pnpm tsx backend/plugins/onefit_api/scripts/import-onefit2-reservations-to-bookings.ts
 */

import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import { AttendanceStatus, BookingStatus } from '@/booking/@types/booking';

interface ExternalReservation {
  _id: string;
  status?: number;
  _p_activity?: string;
  _p_member?: string;
}

interface ExternalActivity {
  _id: string;
  fitPointPrice?: number;
  date?: Date | string;
  startTime?: number;
  endTime?: number;
  price?: number;
  _p_partner?: string;
  _p_activitySubType?: string;
}

interface ExternalCheckIn {
  _id: string;
  _p_activity?: string;
  _p_member?: string;
}

interface ReservationWithRefs {
  reservationId: string;
  activityId: string;
  memberId: string;
}

interface ImportStats {
  scanned: number;
  inserted: number;
  insertErrors: number;
  skippedStatusNotZero: number;
  skippedDuplicate: number;
  skippedMissingPointers: number;
  skippedMissingActivity: number;
  skippedMissingProviderOrCategory: number;
  skippedMissingActivityType: number;
  skippedMissingCustomer: number;
  skippedMissingBookingDate: number;
}

const BATCH_SIZE = 5000;

function extractIdFromPointer(pointer?: string): string | undefined {
  if (!pointer) return undefined;
  const parts = pointer.split('$');
  if (parts.length !== 2) return undefined;
  return parts[1];
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

function minutesToTimeString(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return '00:00';
  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.floor(minutes)));
  const hh = Math.floor(clamped / 60)
    .toString()
    .padStart(2, '0');
  const mm = (clamped % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

function toDate(value?: Date | string): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

async function insertBatched<T extends Record<string, unknown>>(
  collection: mongoose.mongo.Collection,
  items: T[],
  batchSize: number,
  label: string,
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0;
  let errors = 0;

  if (!items.length) return { inserted, errors };

  process.stdout.write(
    `Bulk inserting ${items.length} ${label} (batch size ${batchSize})...\n`,
  );

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    try {
      await collection.insertMany(batch, { ordered: false });
      inserted += batch.length;
      process.stdout.write(
        `  Inserted ${Math.min(i + batchSize, items.length)} / ${
          items.length
        }\n`,
      );
    } catch (err: unknown) {
      const e = err as {
        writeErrors?: unknown[];
        insertedIds?: Record<string, unknown>;
      };

      if (e.writeErrors) {
        const batchInserted = e.insertedIds
          ? Object.keys(e.insertedIds).length
          : 0;
        inserted += batchInserted;
        errors += e.writeErrors.length;
        process.stderr.write(
          `  Batch partial success: ${batchInserted} inserted, ${e.writeErrors.length} errors.\n`,
        );
      } else {
        errors += 1;
        throw err;
      }
    }
  }

  return { inserted, errors };
}

async function loadReservations(
  externalDb: mongoose.mongo.Db,
): Promise<ExternalReservation[]> {
  const reservationCollection = externalDb.collection('Reservation');
  return (await reservationCollection
    .find({ status: 0, _p_subscriptionHistory: { $exists: false } })
    .toArray()) as unknown as ExternalReservation[];
}

async function loadActivitiesByIds(
  externalDb: mongoose.mongo.Db,
  activityIds: string[],
): Promise<Map<string, ExternalActivity>> {
  if (!activityIds.length) return new Map<string, ExternalActivity>();

  const activityCollection = externalDb.collection('Activity');
  const docs = (await activityCollection
    .find({ _id: { $in: activityIds } } as any)
    .toArray()) as unknown as ExternalActivity[];

  const activityById = new Map<string, ExternalActivity>();
  for (const activity of docs) {
    activityById.set(activity._id, activity);
  }
  return activityById;
}

async function loadCheckedInKeys(
  externalDb: mongoose.mongo.Db,
): Promise<Set<string>> {
  const checkInCollection = externalDb.collection('Checkin');
  const checkIns = (await checkInCollection
    .find({})
    .toArray()) as unknown as ExternalCheckIn[];

  const checkedInKeys = new Set<string>();
  for (const checkIn of checkIns) {
    const activityId = extractIdFromPointer(checkIn._p_activity);
    const memberId = extractIdFromPointer(checkIn._p_member);
    if (!activityId || !memberId) continue;
    checkedInKeys.add(`${memberId}:${activityId}`);
  }

  return checkedInKeys;
}

async function loadExistingBookingIds(models: IModels): Promise<Set<string>> {
  const existing = await models.Booking.find({}, { bookingId: 1 }).lean();
  const bookingIds = new Set<string>();

  for (const row of existing) {
    const item = row as { bookingId?: string };
    if (item.bookingId) bookingIds.add(item.bookingId);
  }

  return bookingIds;
}

async function buildBookings({
  reservations,
  activityById,
  checkedInKeys,
  models,
  existingBookingIds,
  stats,
}: {
  reservations: ExternalReservation[];
  activityById: Map<string, ExternalActivity>;
  checkedInKeys: Set<string>;
  models: IModels;
  existingBookingIds: Set<string>;
  stats: ImportStats;
}): Promise<Record<string, unknown>[]> {
  const bookingsToInsert: Record<string, unknown>[] = [];
  const activityTypeIdCache = new Map<string, string>();
  const now = new Date();

  for (const reservation of reservations) {
    stats.scanned += 1;

    if (reservation.status !== 0) {
      stats.skippedStatusNotZero += 1;
      continue;
    }

    const reservationId = reservation._id;
    if (existingBookingIds.has(reservationId)) {
      stats.skippedDuplicate += 1;
      continue;
    }

    const activityId = extractIdFromPointer(reservation._p_activity);
    const memberId = extractIdFromPointer(reservation._p_member);
    if (!activityId || !memberId) {
      stats.skippedMissingPointers += 1;
      continue;
    }

    const activity = activityById.get(activityId);
    if (!activity) {
      stats.skippedMissingActivity += 1;
      continue;
    }

    const providerId = extractIdFromPointer(activity._p_partner);
    const categoryId = extractIdFromPointer(activity._p_activitySubType);
    if (!providerId || !categoryId) {
      stats.skippedMissingProviderOrCategory += 1;
      continue;
    }

    const cacheKey = `${providerId}:${categoryId}`;
    let activityTypeId = activityTypeIdCache.get(cacheKey);
    if (!activityTypeId) {
      const activityType = await models.ActivityType.findOne({
        providerId,
        categoryIds: { $all: [categoryId] },
      }).lean();

      if (!activityType) {
        stats.skippedMissingActivityType += 1;
        continue;
      }

      activityTypeId = String(activityType._id);
      activityTypeIdCache.set(cacheKey, activityTypeId);
    }

    const customer =
      (await models.OneFitCustomer.findOne({ _id: memberId }).lean()) ??
      (await models.OneFitCustomer.findOne({ onefit2UserId: memberId }).lean());
    if (!customer) {
      stats.skippedMissingCustomer += 1;
      continue;
    }

    const userId = String((customer as { _id: unknown })._id);
    const bookingDate = toDate(activity.date);
    if (!bookingDate) {
      stats.skippedMissingBookingDate += 1;
      continue;
    }

    const startMinutes = asNumber(activity.startTime, 0);
    const endMinutes = asNumber(activity.endTime, startMinutes + 60);
    const startTime = minutesToTimeString(startMinutes);
    const endTime = minutesToTimeString(endMinutes);

    const bookingEndDateTime = new Date(bookingDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    bookingEndDateTime.setHours(endHour || 0, endMinute || 0, 0, 0);

    const isPast = bookingEndDateTime < now;
    const isAttended = checkedInKeys.has(`${memberId}:${activityId}`);

    bookingsToInsert.push({
      _id: reservationId,
      bookingId: reservationId,
      userId,
      providerId,
      activityTypeId,
      bookingDate,
      startTime,
      endTime,
      creditCost: asNumber(activity.fitPointPrice),
      price: asNumber(activity.price),
      status: isPast
        ? isAttended
          ? BookingStatus.COMPLETED
          : BookingStatus.NO_SHOW
        : BookingStatus.CONFIRMED,
      attendanceStatus: isPast
        ? isAttended
          ? AttendanceStatus.ATTENDED
          : AttendanceStatus.NO_SHOW
        : AttendanceStatus.PENDING,
      attendedAt: isAttended ? bookingEndDateTime : undefined,
      createdAt: bookingDate,
      modifiedAt: bookingDate,
    });
  }

  return bookingsToInsert;
}

function printSummary(stats: ImportStats): void {
  process.stdout.write('\n=== Reservation to Booking Import Summary ===\n');
  process.stdout.write(`Scanned reservations: ${stats.scanned}\n`);
  process.stdout.write(`Bookings inserted: ${stats.inserted}\n`);
  process.stdout.write(`Insert errors: ${stats.insertErrors}\n`);
  process.stdout.write(
    `Skipped duplicate bookingId: ${stats.skippedDuplicate}\n`,
  );
  process.stdout.write(
    `Skipped missing activity/member pointers: ${stats.skippedMissingPointers}\n`,
  );
  process.stdout.write(
    `Skipped missing activity: ${stats.skippedMissingActivity}\n`,
  );
  process.stdout.write(
    `Skipped missing provider/category: ${stats.skippedMissingProviderOrCategory}\n`,
  );
  process.stdout.write(
    `Skipped missing activity type: ${stats.skippedMissingActivityType}\n`,
  );
  process.stdout.write(
    `Skipped missing customer: ${stats.skippedMissingCustomer}\n`,
  );
  process.stdout.write(
    `Skipped missing booking date: ${stats.skippedMissingBookingDate}\n`,
  );
  process.stdout.write(
    `Skipped non-importable status: ${stats.skippedStatusNotZero}\n`,
  );
  process.stdout.write('Import completed.\n');
}

async function run(): Promise<void> {
  const externalUri = process.env.ONEFIT2_MONGO_URL;
  if (!externalUri) {
    throw new Error('ONEFIT2_MONGO_URL environment variable is required');
  }

  process.stdout.write('Connecting to Onefit2 MongoDB...\n');
  const externalConnection = await mongoose
    .createConnection(externalUri)
    .asPromise();

  try {
    const externalDb = externalConnection.db;
    if (!externalDb) {
      throw new Error('Failed to get external MongoDB database instance');
    }

    const reservations = await loadReservations(externalDb);
    process.stdout.write(
      `Loaded ${reservations.length} reservations (status=0) from Onefit2.\n`,
    );

    const reservationRefs: ReservationWithRefs[] = reservations
      .map((reservation) => {
        const activityId = extractIdFromPointer(reservation._p_activity);
        const memberId = extractIdFromPointer(reservation._p_member);
        if (!activityId || !memberId) return null;
        return {
          reservationId: reservation._id,
          activityId,
          memberId,
        };
      })
      .filter((row): row is ReservationWithRefs => !!row);

    const activityIds = [
      ...new Set(reservationRefs.map((reservation) => reservation.activityId)),
    ];

    const [activityById, checkedInKeys] = await Promise.all([
      loadActivitiesByIds(externalDb, activityIds),
      loadCheckedInKeys(externalDb),
    ]);

    process.stdout.write(
      `Loaded ${activityById.size} activities and ${checkedInKeys.size} check-in keys.\n`,
    );

    await connect();
    process.stdout.write('Connected to local MongoDB.\n');

    const db = mongoose.connection;
    const models: IModels = loadClasses(db);
    const existingBookingIds = await loadExistingBookingIds(models);
    process.stdout.write(
      `Loaded ${existingBookingIds.size} existing bookings by bookingId.\n`,
    );

    const stats: ImportStats = {
      scanned: 0,
      inserted: 0,
      insertErrors: 0,
      skippedStatusNotZero: 0,
      skippedDuplicate: 0,
      skippedMissingPointers: 0,
      skippedMissingActivity: 0,
      skippedMissingProviderOrCategory: 0,
      skippedMissingActivityType: 0,
      skippedMissingCustomer: 0,
      skippedMissingBookingDate: 0,
    };

    const bookingsToInsert = await buildBookings({
      reservations,
      activityById,
      checkedInKeys,
      models,
      existingBookingIds,
      stats,
    });

    process.stdout.write(
      `Prepared ${bookingsToInsert.length} bookings for insertion.\n`,
    );

    const insertResult = await insertBatched(
      models.Booking.collection,
      bookingsToInsert,
      BATCH_SIZE,
      'bookings',
    );

    stats.inserted = insertResult.inserted;
    stats.insertErrors = insertResult.errors;

    printSummary(stats);
  } finally {
    await externalConnection.close();
    await closeMongooose();
  }
}

async function main(): Promise<void> {
  try {
    await run();
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    process.stderr.write(
      `Reservation import failed: ${err.message ?? error}\n`,
    );
    if (err.stack) {
      process.stderr.write(`${err.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
