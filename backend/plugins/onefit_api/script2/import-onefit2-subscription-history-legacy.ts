import mongoose from 'mongoose';
import { cpUserSchema } from 'erxes-api-shared/core-modules';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

// ---------------------------------------------------------------------------
// Types (external Onefit2 shapes)
// ---------------------------------------------------------------------------

interface ExternalSubscriptionHistory {
  expirableFitPoint: any;
  _id: string;
  name?: string;
  nameEn?: string;
  startDate?: Date;
  endDate?: Date;
  status?: number;
  _created_at?: Date;
  _updated_at?: Date;
  _p_member?: string;
  _p_subscription?: string;
  checkInCount?: number;
  price?: number;
  credits?: number;
  activityLimit?: number;
  paidAmount?: number;
  persistentFitPoint?: number;
  usedPersistentFitPoint?: number;
  crm_deal_id?: number;
  multipleActivitiesPerDay?: boolean;
  comment?: string;
}

/** Onefit2 Reservation: valid only when status === 0. Credits come from linked Activity. */
interface ExternalReservation {
  _id: string;
  status?: number;
  _p_activity?: string;
  _p_subscriptionHistory?: string;
  _p_member?: string;
}

interface ExternalCheckIn {
  _id: string;
  _p_activity?: string;
  _p_member?: string;
}

/** Onefit2 Activity: holds credit cost per reservation and scheduling info. */
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
  if (!pointer) {
    return undefined;
  }

  const parts = pointer.split('$');

  if (parts.length !== 2) {
    return undefined;
  }

  return parts[1];
}

interface ImportOptions {
  /** If true, import expired (past) subscription history as well as active/future. Default: false (only active and future). */
  includeExpired?: boolean;
}

interface ImportStats {
  processedUserIds: number;
  customersNotFound: number;
  createdCpUsers: number;
  existingCpUsers: number;
  createdMembershipPurchases: number;
  skippedMembershipPurchases: number;
  membershipPurchaseErrors: number;
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

function minutesToTimeString(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) {
    return '00:00';
  }

  const clamped = Math.max(0, Math.min(24 * 60 - 1, Math.floor(minutes)));
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;

  const hh = hours.toString().padStart(2, '0');
  const mm = mins.toString().padStart(2, '0');

  return `${hh}:${mm}`;
}

function toDate(value?: Date | string): Date | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function isRangeActiveAt(start: Date, end: Date, at: Date): boolean {
  return start <= at && end >= at;
}

function groupHistoriesByUserId(docs: ExternalSubscriptionHistory[]): {
  historiesByUserId: Map<string, ExternalSubscriptionHistory[]>;
  allHistoryIds: string[];
} {
  const historiesByUserId = new Map<string, ExternalSubscriptionHistory[]>();
  const allHistoryIds: string[] = [];

  for (const history of docs) {
    const memberId = extractIdFromPointer(history._p_member);
    if (!memberId) continue;

    if (!historiesByUserId.has(memberId)) {
      historiesByUserId.set(memberId, []);
    }
    historiesByUserId.get(memberId)!.push(history);
    allHistoryIds.push(history._id);
  }

  return { historiesByUserId, allHistoryIds };
}

interface ReservationWithActivityIds {
  reservationId: string;
  memberId: string;
  historyId: string;
  activityId: string;
}

interface UsedPersistentFitPointContext {
  usedByHistoryId: Map<string, number>;
  reservations: ReservationWithActivityIds[];
  activities: ExternalActivity[];
  checkedInReservationKeys: Set<string>;
}

interface OneFitCustomerLike {
  _id: unknown;
  primaryEmail?: string;
  emails?: string[];
  primaryPhone?: string;
  phones?: string[];
  firstName?: string;
  lastName?: string;
}

async function buildUsedPersistentFitPointContext(
  externalDb: mongoose.mongo.Db,
): Promise<UsedPersistentFitPointContext> {
  const reservationCollection = externalDb.collection('Reservation');
  const activityCollection = externalDb.collection('Activity');
  const checkInCollection = externalDb.collection('CheckIn');

  const reservations = (await reservationCollection
    .find({ status: 0 })
    .toArray()) as unknown as ExternalReservation[];

  const activityIds = [
    ...new Set(
      reservations
        .map((r) => extractIdFromPointer(r._p_activity))
        .filter((id): id is string => !!id),
    ),
  ];

  const activityDocs = (await activityCollection
    .find({ _id: { $in: activityIds } } as any)
    .toArray()) as unknown as ExternalActivity[];

  const activityCreditById = new Map<string, number>();
  for (const a of activityDocs) {
    activityCreditById.set(a._id, asNumber(a.fitPointPrice));
  }

  const checkInDocs = (await checkInCollection
    .find({})
    .toArray()) as unknown as ExternalCheckIn[];

  const checkedInReservationKeys = new Set<string>();
  for (const checkIn of checkInDocs) {
    const activityId = extractIdFromPointer(checkIn._p_activity);
    const memberId = extractIdFromPointer(checkIn._p_member);
    if (!activityId || !memberId) {
      continue;
    }

    checkedInReservationKeys.add(`${memberId}:${activityId}`);
  }

  const usedByHistoryId = new Map<string, number>();
  const reservationsWithActivityIds: ReservationWithActivityIds[] = [];

  for (const r of reservations) {
    const historyId = extractIdFromPointer(r._p_subscriptionHistory);
    const activityId = extractIdFromPointer(r._p_activity);
    const memberId = extractIdFromPointer(r._p_member);
    if (!historyId || !activityId || !memberId) continue;

    const credit = activityCreditById.get(activityId) ?? 0;
    usedByHistoryId.set(
      historyId,
      (usedByHistoryId.get(historyId) ?? 0) + credit,
    );

    reservationsWithActivityIds.push({
      reservationId: r._id,
      memberId,
      historyId,
      activityId,
    });
  }

  process.stdout.write(
    `Computed usedPersistentFitPoint from ${reservations.length} reservations (status=0), ${activityDocs.length} activities, and ${checkInDocs.length} check-ins\n`,
  );

  return {
    usedByHistoryId,
    reservations: reservationsWithActivityIds,
    activities: activityDocs,
    checkedInReservationKeys,
  };
}

async function loadExistingHistoryIds(
  models: IModels,
  historyIds: string[],
): Promise<Set<string>> {
  const existing = new Set<string>();
  if (historyIds.length === 0) return existing;

  const purchases = await models.MembershipPurchase.find(
    { externalHistoryId: { $in: historyIds } },
    { externalHistoryId: 1 },
  ).lean();

  for (const p of purchases) {
    const row = p as Record<string, unknown>;
    if (row.externalHistoryId) {
      existing.add(String(row.externalHistoryId));
    }
  }

  process.stdout.write(
    `Existing membership purchases with externalHistoryId: ${existing.size}\n`,
  );
  return existing;
}

async function ensureOneFitCustomerForUserId(
  models: IModels,
  userId: string,
): Promise<OneFitCustomerLike | null> {
  let customer = await models.OneFitCustomer.findOne({ _id: userId });
  if (customer) {
    return customer;
  }

  // Try upgrading an existing core customer document in the same collection to OneFitCustomer
  await models.OneFitCustomer.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        __t: 'OneFitCustomer',
        membershipStatus: 'none',
        currentCreditBalance: 0,
        totalCreditsEarned: 0,
        totalCreditsUsed: 0,
        totalBookings: 0,
      },
    },
    { upsert: false, new: true },
  );

  customer = await models.OneFitCustomer.findOne({ _id: userId });

  return customer as OneFitCustomerLike | null;
}

async function insertBatched<T extends Record<string, unknown>>(
  collection: mongoose.mongo.Collection,
  items: T[],
  batchSize: number,
  label: string,
): Promise<{ inserted: number; errors: number }> {
  let inserted = 0;
  let errors = 0;

  if (items.length === 0) {
    return { inserted: 0, errors: 0 };
  }

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

interface ProcessedHistoryResult {
  skip: true;
  skipCount: number;
}
interface ProcessedHistorySuccess {
  skip: false;
  purchase: Record<string, unknown>;
  isActiveNow: boolean;
  expiresAt: Date | undefined;
  subscriptionId: string;
}

type ClientPortalUserOutcome = 'created' | 'existing' | 'skipped';

interface UserProcessingCounters {
  processedUserIds: number;
  createdCpUsers: number;
  existingCpUsers: number;
  skippedMembershipPurchases: number;
  membershipPurchaseErrors: number;
  customersNotFound: number;
}

interface UserProcessingContext {
  historiesByUserId: Map<string, ExternalSubscriptionHistory[]>;
  existingHistoryIds: Set<string>;
  includeExpired: boolean;
  models: IModels;
  CPUserModel: mongoose.Model<unknown>;
  clientPortalId: string;
  purchasesToInsert: any[];
  counters: UserProcessingCounters;
}

async function processUsersAndHistories({
  historiesByUserId,
  existingHistoryIds,
  includeExpired,
  models,
  CPUserModel,
  clientPortalId,
  purchasesToInsert,
  counters,
}: UserProcessingContext): Promise<void> {
  for (const [userId, histories] of historiesByUserId) {
    counters.processedUserIds += 1;

    const customer = await ensureOneFitCustomerForUserId(models, userId);

    if (!customer) {
      counters.customersNotFound += 1;
      continue;
    }

    const customerId = String(customer._id);
    const now = new Date();

    try {
      for (const history of histories) {
        try {
          // Process one history row: returns either a skip marker
          // or a normalized purchase/credit payload for insertion.
          const result = processOneHistory(
            history,
            customerId,
            existingHistoryIds,
            now,
            { includeExpired },
          );

          if (result.skip) {
            counters.skippedMembershipPurchases += result.skipCount;
            continue;
          }

          purchasesToInsert.push(result.purchase);
        } catch (err: unknown) {
          const error = err as { message?: string };
          counters.membershipPurchaseErrors += 1;
          process.stderr.write(
            `Error creating membership purchase for history ${
              history._id
            } and user ${userId}: ${error.message ?? error}\n`,
          );
        }
      }

      const cpOutcome = await ensureClientPortalUser(
        CPUserModel as unknown as mongoose.Model<unknown>,
        clientPortalId,
        customer,
      );
      if (cpOutcome === 'existing') {
        counters.existingCpUsers += 1;
      } else if (cpOutcome === 'created') {
        counters.createdCpUsers += 1;
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      process.stderr.write(
        `Error processing user ${userId}: ${error.message ?? error}\n`,
      );
    }
  }
}

async function buildBookingsFromReservations(
  reservations: ReservationWithActivityIds[],
  activities: ExternalActivity[],
  checkedInReservationKeys: Set<string>,
  models: IModels,
): Promise<any[]> {
  const activityById = new Map<string, ExternalActivity>();
  for (const activity of activities) {
    activityById.set(activity._id, activity);
  }

  const bookingsToInsert: any[] = [];
  const activityTypeIdCache = new Map<string, string>();

  for (const r of reservations) {
    const activity = activityById.get(r.activityId);
    if (!activity) continue;

    const providerId = extractIdFromPointer(activity._p_partner);
    const categoryId = extractIdFromPointer(activity._p_activitySubType);

    if (!providerId || !categoryId) continue;

    const cacheKey = `${providerId}:${categoryId}`;
    let activityTypeId = activityTypeIdCache.get(cacheKey);

    if (!activityTypeId) {
      const activityType = await models.ActivityType.findOne({
        providerId,
        categoryIds: { $all: [categoryId] },
      }).lean();

      if (!activityType) continue;

      activityTypeId = String(activityType._id);
      activityTypeIdCache.set(cacheKey, activityTypeId);
    }

    const bookingNow = new Date();
    const booking = buildBookingDocument({
      reservation: r,
      activity,
      activityTypeId,
      checkedInReservationKeys,
      now: bookingNow,
    });

    if (!booking) continue;

    bookingsToInsert.push({
      ...booking,
      providerId,
    });
  }

  return bookingsToInsert;
}

interface BookingBuildInput {
  reservation: ReservationWithActivityIds;
  activity: ExternalActivity;
  activityTypeId: string;
  checkedInReservationKeys: Set<string>;
  now: Date;
}

async function ensureClientPortalUser(
  CPUserModel: mongoose.Model<unknown>,
  clientPortalId: string,
  customer: OneFitCustomerLike,
): Promise<ClientPortalUserOutcome> {
  const customerId = String(customer._id);
  const email =
    customer.primaryEmail ?? (customer.emails && customer.emails[0]);
  const phone =
    customer.primaryPhone ?? (customer.phones && customer.phones[0]);

  if (!email && !phone) {
    return 'skipped';
  }

  let cpUser = await CPUserModel.findOne({
    clientPortalId,
    erxesCustomerId: customerId,
  }).lean();

  if (!cpUser && email) {
    cpUser = await CPUserModel.findOne({
      clientPortalId,
      email,
    }).lean();
  }
  if (!cpUser && phone) {
    cpUser = await CPUserModel.findOne({
      clientPortalId,
      phone,
    }).lean();
  }

  if (cpUser) {
    return 'existing';
  }

  const now = new Date();
  await CPUserModel.create({
    type: 'customer',
    clientPortalId,
    erxesCustomerId: customerId,
    email,
    phone,
    username: email ?? phone ?? customerId,
    firstName: customer.firstName,
    lastName: customer.lastName,
    isVerified: true,
    isEmailVerified: !!email,
    isPhoneVerified: !!phone,
    createdAt: now,
    updatedAt: now,
  });

  return 'created';
}

function buildBookingDocument({
  reservation,
  activity,
  activityTypeId,
  checkedInReservationKeys,
  now,
}: BookingBuildInput): Record<string, unknown> | null {
  const bookingDate = toDate(activity.date);
  if (!bookingDate) {
    return null;
  }

  const startMinutes = asNumber(activity.startTime);
  const endMinutes = asNumber(activity.endTime, startMinutes + 60);
  const startTime = minutesToTimeString(startMinutes);
  const endTime = minutesToTimeString(endMinutes);

  const bookingEndDateTime = new Date(bookingDate);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  bookingEndDateTime.setHours(endHour || 0, endMinute || 0, 0, 0);

  const reservationKey = `${reservation.memberId}:${reservation.activityId}`;
  const isCompleted = checkedInReservationKeys.has(reservationKey);
  const isPast = bookingEndDateTime < now;

  return {
    _id: String(reservation.reservationId),
    userId: reservation.memberId,
    activityTypeId,
    bookingDate,
    startTime,
    endTime,
    creditCost: asNumber(activity.fitPointPrice),
    price: asNumber(activity.price),
    status: isPast ? (isCompleted ? 'completed' : 'no_show') : 'confirmed',
    attendanceStatus: isPast
      ? isCompleted
        ? 'attended'
        : 'not_attended'
      : 'pending',
    attendedAt: isCompleted ? bookingEndDateTime : undefined,
    bookingId: reservation.reservationId,
    // Preserve historical timestamps on imported bookings.
    createdAt: bookingDate,
    modifiedAt: bookingDate,
  };
}

function buildImportContextFromEnv(): {
  importOptions?: ImportOptions;
} {
  return {
    importOptions: { includeExpired: true },
  };
}

function processOneHistory(
  history: ExternalSubscriptionHistory,
  customerId: string,
  existingHistoryIds: Set<string>,
  now: Date,
  options: { includeExpired?: boolean } = {},
): ProcessedHistoryResult | ProcessedHistorySuccess {
  const historyId = history._id;

  if (history.status !== 1) {
    return { skip: true, skipCount: 1 };
  }
  if (existingHistoryIds.has(historyId)) {
    return { skip: true, skipCount: 1 };
  }

  const subscriptionId = extractIdFromPointer(history._p_subscription);
  if (!subscriptionId) {
    return { skip: true, skipCount: 1 };
  }

  const start = toDate(history.startDate);
  const end = toDate(history.endDate);
  if (!start || !end) {
    return { skip: true, skipCount: 1 };
  }

  const isActiveNow = isRangeActiveAt(start, end, now);
  const isExpired = end < now;
  if (!options.includeExpired && !isActiveNow && isExpired) {
    return { skip: true, skipCount: 1 };
  }

  const amount = asNumber(history.price);
  const purchasedAt =
    toDate(history._created_at) ?? toDate(history.startDate) ?? now;
  const expiresAt = toDate(history.endDate);

  const purchase: Record<string, unknown> = {
    _id: historyId,
    userId: customerId,
    planId: subscriptionId,
    status: 'paid',
    activatedAt: isActiveNow || isExpired ? purchasedAt : undefined,
    purchasedAt,
    expiresAt,
    amount,
    externalHistoryId: historyId,
    createdAt: new Date(),
  };

  return {
    skip: false,
    purchase,
    isActiveNow,
    expiresAt: expiresAt ?? undefined,
    subscriptionId,
  };
}

function printImportSummary(stats: ImportStats): void {
  process.stdout.write(
    '\n=== Onefit2 Subscription History Import Summary ===\n',
  );
  process.stdout.write(
    `User ids with history processed: ${stats.processedUserIds}\n`,
  );
  process.stdout.write(
    `Customers not found (run user import first): ${stats.customersNotFound}\n`,
  );
  process.stdout.write(
    `Client portal users created: ${stats.createdCpUsers}\n`,
  );
  process.stdout.write(
    `Existing client portal users matched: ${stats.existingCpUsers}\n`,
  );
  process.stdout.write(
    `Membership purchases created: ${stats.createdMembershipPurchases}\n`,
  );
  process.stdout.write(
    `Membership purchases skipped (already existed or invalid): ${stats.skippedMembershipPurchases}\n`,
  );
  process.stdout.write(
    `Membership purchases errors: ${stats.membershipPurchaseErrors}\n`,
  );
  process.stdout.write('Import completed.\n');
}

const BATCH_SIZE = 5000;

async function importOnefit2SubscriptionHistory(
  externalUri: string,
  importOptions?: ImportOptions,
): Promise<void> {
  const includeExpired = importOptions?.includeExpired ?? false;

  process.stdout.write('Starting import of Onefit2 subscription history...\n');
  if (includeExpired) {
    process.stdout.write(
      'Including old (expired) purchase history (SUBSCRIPTION_INCLUDE_EXPIRED=true).\n',
    );
  }

  if (!externalUri) {
    throw new Error(
      'External MongoDB URI for onefit2 is required (ONEFIT2_MONGO_URL)',
    );
  }

  process.stdout.write(
    `Connecting to external MongoDB (onefit2): ${externalUri}\n`,
  );

  const externalConnection = await mongoose
    .createConnection(externalUri)
    .asPromise();

  try {
    const externalDb = externalConnection.db;

    if (!externalDb) {
      throw new Error('Failed to acquire external MongoDB database instance');
    }

    const subscriptionHistoryCollection = externalDb.collection(
      'SubscriptionHistory',
    );

    const subscriptionHistoryDocs = (await subscriptionHistoryCollection
      .find({ status: 1 })
      .toArray()) as unknown as ExternalSubscriptionHistory[];

    process.stdout.write(
      `Loaded ${subscriptionHistoryDocs.length} subscription history records from onefit2\n`,
    );

    // Returns:
    // - historiesByUserId: Map<memberId, ExternalSubscriptionHistory[]>
    // - allHistoryIds: string[] of included history _id values
    const { historiesByUserId, allHistoryIds } = groupHistoriesByUserId(
      subscriptionHistoryDocs,
    );

    const { reservations, activities, checkedInReservationKeys } =
      await buildUsedPersistentFitPointContext(externalDb);

    await connect();
    process.stdout.write('Connected to local MongoDB\n');

    const db: mongoose.Connection = mongoose.connection;
    const models: IModels = loadClasses(db);

    const existingHistoryIds = await loadExistingHistoryIds(
      models,
      allHistoryIds,
    );

    const clientPortal = await db.collection('client_portals').findOne({});

    if (!clientPortal) {
      throw new Error(
        'No client portal found in local database (client_portals collection is empty)',
      );
    }

    const clientPortalId = String(clientPortal._id);

    process.stdout.write(`Using client portal: ${clientPortalId}\n`);

    const CPUserModel = db.model('client_portal_users', cpUserSchema);

    const counters: UserProcessingCounters = {
      processedUserIds: 0,
      createdCpUsers: 0,
      existingCpUsers: 0,
      skippedMembershipPurchases: 0,
      membershipPurchaseErrors: 0,
      customersNotFound: 0,
    };

    const purchasesToInsert: any[] = [];
    await processUsersAndHistories({
      historiesByUserId,
      existingHistoryIds,
      includeExpired,
      models,
      CPUserModel: CPUserModel as unknown as mongoose.Model<unknown>,
      clientPortalId,
      purchasesToInsert,
      counters,
    });

    const bookingsToInsert = await buildBookingsFromReservations(
      reservations,
      activities,
      checkedInReservationKeys,
      models,
    );

    const purchaseResult = await insertBatched(
      models.MembershipPurchase.collection,
      purchasesToInsert,
      BATCH_SIZE,
      'membership purchases',
    );

    const bookingResult = await insertBatched(
      models.Booking.collection,
      bookingsToInsert,
      BATCH_SIZE,
      'bookings',
    );

    const stats: ImportStats = {
      processedUserIds: counters.processedUserIds,
      customersNotFound: counters.customersNotFound,
      createdCpUsers: counters.createdCpUsers,
      existingCpUsers: counters.existingCpUsers,
      createdMembershipPurchases: purchaseResult.inserted,
      skippedMembershipPurchases: counters.skippedMembershipPurchases,
      membershipPurchaseErrors:
        counters.membershipPurchaseErrors + purchaseResult.errors,
    };

    printImportSummary(stats);
  } finally {
    await externalConnection.close();
    await closeMongooose();
  }
}

async function main() {
  const externalUri = process.env.ONEFIT2_MONGO_URL;

  if (!externalUri) {
    throw new Error('ONEFIT2_MONGO_URL environment variable is required');
  }

  const { importOptions } = buildImportContextFromEnv();

  try {
    await importOnefit2SubscriptionHistory(externalUri, importOptions);
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    process.stderr.write(
      `Onefit2 subscription history import failed: ${err.message ?? error}\n`,
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

// Run user import first: pnpm tsx scripts/import-onefit2-users.ts
// Optional env:
//   SUBSCRIPTION_INCLUDE_EXPIRED=true or IMPORT_OLD_PURCHASE_HISTORY=true = include expired (old) purchase history
// Example: ONEFIT2_MONGO_URL=... SUBSCRIPTION_INCLUDE_EXPIRED=true pnpm tsx scripts/import-onefit2-subscription-history.ts
