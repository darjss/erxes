/**
 * Import extra reservations from reservetion_extra.json into onefit bookings.
 *
 * Prerequisites:
 * - OneFit customers must exist (run import-onefit2-users.ts first).
 * - Activity types and providers must exist in local DB.
 *
 * Environment:
 * - MONGO_URL: local erxes MongoDB
 * - ONEFIT2_MONGO_URL: Onefit2 MongoDB (to fetch Activity documents for date/time/credit)
 *
 * Usage:
 *   pnpm tsx backend/plugins/onefit_api/scripts/import-extra-reservations-to-bookings.ts [reservetion_extra.json]
 *
 * Optional: pass JSON file path as first argument, or set EXTRA_RESERVATIONS_JSON, or use default scripts/reservetion_extra.json
 */

import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import { BookingStatus, AttendanceStatus } from '@/booking/@types/booking';
import {
  CreditTransactionType,
  CreditSource,
} from '@/membership/@types/credittransaction';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExtraReservationRow {
  _id: string;
  _p_activity?: string;
  _p_member?: string;
  status?: number;
  _p_subscriptionHistory?: string;
  cancelledAt?: string;
  _p_cancelledBy?: string;
  description?: string;
  _created_at?: string;
  _updated_at?: string;
}

/** Onefit2 Activity: date, time, credit cost, partner, activitySubType. */
interface ExternalActivity {
  _id: string;
  fitPointPrice?: number;
  date?: Date | string;
  startTime?: number;
  endTime?: number;
  price?: number;
  status?: number;
  _p_partner?: string;
  _p_activitySubType?: string;
}

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
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}`;
}

function toDate(value?: Date | string): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

async function loadExtraReservations(
  filePath: string,
): Promise<ExtraReservationRow[]> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('JSON must be an array of reservation objects');
  }
  return data as ExtraReservationRow[];
}

async function fetchActivitiesForReservations(
  externalDb: mongoose.mongo.Db,
  activityIds: string[],
): Promise<ExternalActivity[]> {
  if (activityIds.length === 0) return [];
  const collection = externalDb.collection('Activity');
  const docs = (await collection
    .find({ _id: { $in: activityIds } } as any)
    .toArray()) as unknown as ExternalActivity[];
  return docs;
}

async function insertBatched<T extends Record<string, unknown>>(
  collection: mongoose.mongo.Collection,
  items: T[],
  batchSize: number,
  label: string,
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0;
  let errors = 0;
  if (items.length === 0) return { inserted: 0, errors: 0 };

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
          `  Batch partial success: ${batchInserted} inserted, ${e.writeErrors.length} errors (e.g. duplicates)\n`,
        );
      } else {
        errors += 1;
        throw err;
      }
    }
  }
  return { inserted, errors };
}

const BATCH_SIZE = 5000;

async function run(): Promise<void> {
  const jsonPath =
    process.argv[2]?.trim() ||
    process.env.EXTRA_RESERVATIONS_JSON ||
    path.join(__dirname, 'reservetion_extra.json');

  if (!fs.existsSync(jsonPath)) {
    throw new Error(
      `Extra reservations file not found: ${jsonPath}. Pass path as first argument or set EXTRA_RESERVATIONS_JSON.`,
    );
  }

  const externalUri = process.env.ONEFIT2_MONGO_URL;
  if (!externalUri) {
    throw new Error(
      'ONEFIT2_MONGO_URL is required to fetch Activity documents (date, time, credit, partner).',
    );
  }

  process.stdout.write(`Loading extra reservations from ${jsonPath}...\n`);
  const extraReservations = await loadExtraReservations(jsonPath);
  process.stdout.write(`Loaded ${extraReservations.length} reservations.\n`);

  const activityIds = [
    ...new Set(
      extraReservations
        .map((r) => extractIdFromPointer(r._p_activity))
        .filter((id): id is string => !!id),
    ),
  ];
  process.stdout.write(
    `Unique activity IDs to fetch: ${activityIds.length}.\n`,
  );

  process.stdout.write('Connecting to Onefit2 MongoDB...\n');
  const externalConnection = await mongoose
    .createConnection(externalUri)
    .asPromise();
  const externalDb = externalConnection.db;
  if (!externalDb) {
    throw new Error('Failed to get external DB');
  }

  const activities = await fetchActivitiesForReservations(
    externalDb,
    activityIds,
  );
  await externalConnection.close();
  process.stdout.write(`Fetched ${activities.length} activities.\n`);

  const activityById = new Map<string, ExternalActivity>();
  for (const a of activities) {
    activityById.set(a._id, a);
  }

  await connect();
  process.stdout.write('Connected to local MongoDB.\n');

  const db = mongoose.connection;
  const models: IModels = loadClasses(db);

  const existingBookingIds = new Set<string>();
  const existing = await models.Booking.find({}, { bookingId: 1 }).lean();
  for (const b of existing) {
    const row = b as { bookingId?: string };
    if (row.bookingId) existingBookingIds.add(row.bookingId);
  }
  process.stdout.write(
    `Existing bookings (by bookingId): ${existingBookingIds.size}. Skipping duplicates.\n`,
  );

  const activityTypeIdCache = new Map<string, string>();
  const now = new Date();
  const bookingsToInsert: Record<string, unknown>[] = [];
  /** For non-cancelled bookings: used to build USAGE credit transactions. */
  const usageRows: { userId: string; bookingId: string; creditCost: number; bookingDate: Date }[] = [];
  let skippedNoActivity = 0;
  let skippedNoCustomer = 0;
  let skippedDuplicate = 0;
  let skippedNoProviderOrCategory = 0;
  let skippedStatusNotZero = 0;

  for (const r of extraReservations) {
    if (r.status !== 0) {
      skippedStatusNotZero += 1;
      continue;
    }

    const reservationId = r._id;
    if (existingBookingIds.has(reservationId)) {
      skippedDuplicate += 1;
      continue;
    }

    const activityId = extractIdFromPointer(r._p_activity);
    const memberId = extractIdFromPointer(r._p_member);
    if (!activityId || !memberId) continue;

    const activity = activityById.get(activityId);
    if (!activity) {
      skippedNoActivity += 1;
      continue;
    }

    const providerId = extractIdFromPointer(activity._p_partner);
    const categoryId = extractIdFromPointer(activity._p_activitySubType);
    if (!providerId || !categoryId) {
      skippedNoProviderOrCategory += 1;
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
        skippedNoProviderOrCategory += 1;
        continue;
      }
      activityTypeId = String(activityType._id);
      activityTypeIdCache.set(cacheKey, activityTypeId);
    }

    const customer =
      (await models.OneFitCustomer.findOne({ _id: memberId }).lean()) ??
      (await models.OneFitCustomer.findOne({ onefit2UserId: memberId }).lean());
    if (!customer) {
      skippedNoCustomer += 1;
      continue;
    }
    const userId = String((customer as { _id: unknown })._id);

    const bookingDateRaw = toDate(activity.date);
    if (!bookingDateRaw) continue;

    const startMinutes = asNumber(activity.startTime, 0);
    const endMinutes = asNumber(activity.endTime, startMinutes + 60);
    const startTime = minutesToTimeString(startMinutes);
    const endTime = minutesToTimeString(endMinutes);

    const creditCost =
      typeof activity.fitPointPrice === 'number' &&
      !Number.isNaN(activity.fitPointPrice)
        ? activity.fitPointPrice
        : 0;
    const price =
      typeof activity.price === 'number' && !Number.isNaN(activity.price)
        ? activity.price
        : 0;

    const bookingEndDateTime = new Date(bookingDateRaw);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    bookingEndDateTime.setHours(endHour || 0, endMinute || 0, 0, 0);
    const isPast = bookingEndDateTime < now;

    const isCancelled =
      r.cancelledAt != null && String(r.cancelledAt).length > 0;
    const cancelledAt = r.cancelledAt ? toDate(r.cancelledAt) : undefined;
    const cancelledBy = extractIdFromPointer(r._p_cancelledBy);

    const status = isCancelled
      ? BookingStatus.CANCELLED
      : isPast
      ? BookingStatus.COMPLETED
      : BookingStatus.CONFIRMED;

    const attendanceStatus = isCancelled
      ? AttendanceStatus.PENDING
      : isPast
      ? AttendanceStatus.ATTENDED
      : AttendanceStatus.PENDING;

    bookingsToInsert.push({
      _id: reservationId,
      userId,
      providerId,
      activityTypeId,
      bookingDate: bookingDateRaw,
      startTime,
      endTime,
      creditCost,
      price: price || undefined,
      status,
      attendanceStatus,
      bookingId: reservationId + '_extra',
      cancelledAt: cancelledAt ?? undefined,
      cancelledBy: cancelledBy ?? undefined,
      cancellationReason: r.description ?? undefined,
      attendedAt: !isCancelled && isPast ? bookingEndDateTime : undefined,
      createdAt: now,
      modifiedAt: now,
    });

    if (!isCancelled && creditCost > 0) {
      usageRows.push({
        userId,
        bookingId: reservationId,
        creditCost,
        bookingDate: bookingDateRaw,
      });
    }
  }

  process.stdout.write(
    `Skipped: status≠0 ${skippedStatusNotZero}, no activity ${skippedNoActivity}, no customer ${skippedNoCustomer}, duplicate ${skippedDuplicate}, no provider/category ${skippedNoProviderOrCategory}.\n`,
  );
  process.stdout.write(`Bookings to insert: ${bookingsToInsert.length}.\n`);

  const result = await insertBatched(
    models.Booking.collection,
    bookingsToInsert,
    BATCH_SIZE,
    'bookings',
  );

  // Build USAGE credit transactions for non-cancelled bookings (per-user running balance)
  const creditTransactionsToInsert: Record<string, unknown>[] = [];
  const userIds = [...new Set(usageRows.map((u) => u.userId))];
  for (const uid of userIds) {
    const userRows = usageRows.filter((u) => u.userId === uid);
    userRows.sort((a, b) => a.bookingDate.getTime() - b.bookingDate.getTime());
    let balance = await models.CreditTransaction.getUserBalance(uid);
    for (const row of userRows) {
      balance -= row.creditCost;
      creditTransactionsToInsert.push({
        _id: `extra-usage-${row.bookingId}`,
        userId: uid,
        amount: -row.creditCost,
        transactionType: CreditTransactionType.USAGE,
        source: CreditSource.INDIVIDUAL,
        bookingId: row.bookingId,
        description: 'Imported booking (extra reservation)',
        balanceAfter: balance,
        createdAt: now,
      });
    }
  }

  let creditResult = { inserted: 0, errors: 0 };
  if (creditTransactionsToInsert.length > 0) {
    process.stdout.write(
      `Credit transactions to insert: ${creditTransactionsToInsert.length}.\n`,
    );
    creditResult = await insertBatched(
      models.CreditTransaction.collection,
      creditTransactionsToInsert,
      BATCH_SIZE,
      'credit transactions',
    );
  }

  process.stdout.write(
    `\n=== Extra reservations import summary ===\nBookings inserted: ${result.inserted}, Errors: ${result.errors}\nCredit transactions inserted: ${creditResult.inserted}, Errors: ${creditResult.errors}\nDone.\n`,
  );

  await closeMongooose();
}

async function main(): Promise<void> {
  try {
    await run();
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    process.stderr.write(`Import failed: ${err.message ?? error}\n`);
    if (err.stack) process.stderr.write(`${err.stack}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
