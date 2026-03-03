import mongoose from 'mongoose';
import { cpUserSchema } from 'erxes-api-shared/core-modules';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import {
  CreditSource,
  CreditTransactionType,
} from '@/membership/@types/credittransaction';
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

interface SubscriptionDateFilter {
  fromDate?: Date;
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
  createdCreditTransactions: number;
  creditTransactionErrors: number;
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

function getHistoryCreditDelta(
  history: ExternalSubscriptionHistory,
  usedPersistentFitPointByHistoryId: Map<string, number>,
): number {
  const historyId = history._id;

  const persistent =
    typeof history.persistentFitPoint === 'number'
      ? history.persistentFitPoint
      : 0;
  const expirableFitPoint =
    typeof history.expirableFitPoint === 'number'
      ? history.expirableFitPoint
      : 0;

  const usedPersistent = usedPersistentFitPointByHistoryId.has(historyId)
    ? usedPersistentFitPointByHistoryId.get(historyId)!
    : typeof history.usedPersistentFitPoint === 'number'
      ? history.usedPersistentFitPoint
      : 0;

  return persistent + expirableFitPoint - usedPersistent;
}

function passesDateFilter(
  history: ExternalSubscriptionHistory,
  filter?: SubscriptionDateFilter,
): boolean {
  const start = toDate(history.startDate);
  const end = toDate(history.endDate);

  if (!start || !end) {
    return false;
  }

  if (filter?.fromDate) {
    // Only import histories whose membership start date is within the window
    if (start < filter.fromDate) {
      return false;
    }
  }

  return true;
}

function groupHistoriesByUserId(
  docs: ExternalSubscriptionHistory[],
  dateFilter?: SubscriptionDateFilter,
): {
  historiesByUserId: Map<string, ExternalSubscriptionHistory[]>;
  allHistoryIds: string[];
} {
  const historiesByUserId = new Map<string, ExternalSubscriptionHistory[]>();
  const allHistoryIds: string[] = [];

  for (const history of docs) {
    if (!passesDateFilter(history, dateFilter)) continue;

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
}

async function buildUsedPersistentFitPointContext(
  externalDb: mongoose.mongo.Db,
): Promise<UsedPersistentFitPointContext> {
  const reservationCollection = externalDb.collection('Reservation');
  const activityCollection = externalDb.collection('Activity');

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
    `Computed usedPersistentFitPoint from ${reservations.length} reservations (status=0) and ${activityDocs.length} activities\n`,
  );

  return {
    usedByHistoryId,
    reservations: reservationsWithActivityIds,
    activities: activityDocs,
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
): Promise<unknown | null> {
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

  return customer;
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
  creditTransactions?: Record<string, unknown>[];
  creditDelta: number;
  isActiveNow: boolean;
  purchasedAt: Date;
  expiresAt: Date | undefined;
  subscriptionId: string;
  newRunningBalance: number;
}

type ClientPortalUserOutcome = 'created' | 'existing' | 'skipped';

async function ensureClientPortalUser(
  CPUserModel: mongoose.Model<unknown>,
  clientPortalId: string,
  customer: {
    _id: unknown;
    primaryEmail?: string;
    emails?: string[];
    primaryPhone?: string;
    phones?: string[];
    firstName?: string;
    lastName?: string;
  },
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

function processOneHistory(
  history: ExternalSubscriptionHistory,
  customerId: string,
  existingHistoryIds: Set<string>,
  usedPersistentFitPointByHistoryId: Map<string, number>,
  runningBalance: number,
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

  const creditDelta = getHistoryCreditDelta(
    history,
    usedPersistentFitPointByHistoryId,
  );

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

  const creditTransactions: Record<string, unknown>[] = [];
  let newRunningBalance = runningBalance;

  if (creditDelta > 0) {
    if (isActiveNow) {
      newRunningBalance = runningBalance + creditDelta;
      creditTransactions.push({
        _id: `${historyId}-${customerId}-${purchasedAt.getTime()}`,
        userId: customerId,
        amount: creditDelta,
        transactionType: CreditTransactionType.PURCHASE,
        source: CreditSource.INDIVIDUAL,
        description: 'Imported credits from Onefit2 subscription',
        balanceAfter: newRunningBalance,
        createdAt: purchasedAt,
      });
    } else if (isExpired) {
      // For expired subscriptions: record both a purchase and a matching usage
      // so that history shows credits granted and fully used, without
      // affecting the customer's current balance.
      const purchaseTx = {
        _id: `${historyId}-${customerId}-${purchasedAt.getTime()}`,
        userId: customerId,
        amount: creditDelta,
        transactionType: CreditTransactionType.PURCHASE,
        source: CreditSource.INDIVIDUAL,
        description:
          'Imported credits from Onefit2 subscription (expired, history only)',
        balanceAfter: runningBalance,
        createdAt: purchasedAt,
      };
      const usageTx = {
        _id: `${historyId}-${customerId}-${purchasedAt.getTime()}-usage`,
        userId: customerId,
        amount: -creditDelta,
        transactionType: CreditTransactionType.USAGE,
        source: CreditSource.INDIVIDUAL,
        description:
          'Imported credit usage for expired Onefit2 subscription (history only)',
        balanceAfter: runningBalance,
        createdAt: purchasedAt,
      };

      creditTransactions.push(purchaseTx, usageTx);
    }
  }

  return {
    skip: false,
    purchase,
    creditTransactions: creditTransactions.length
      ? creditTransactions
      : undefined,
    creditDelta,
    isActiveNow,
    purchasedAt,
    expiresAt: expiresAt ?? undefined,
    subscriptionId,
    newRunningBalance,
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
  process.stdout.write(
    `Credit transactions created: ${stats.createdCreditTransactions}\n`,
  );
  process.stdout.write(
    `Credit transactions errors: ${stats.creditTransactionErrors}\n`,
  );
  process.stdout.write('Import completed.\n');
}

const BATCH_SIZE = 5000;

async function importOnefit2SubscriptionHistory(
  externalUri: string,
  dateFilter?: SubscriptionDateFilter,
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
      .find({})
      .toArray()) as unknown as ExternalSubscriptionHistory[];

    process.stdout.write(
      `Loaded ${subscriptionHistoryDocs.length} subscription history records from onefit2\n`,
    );

    if (dateFilter?.fromDate) {
      process.stdout.write(
        `Filtering: only subscriptions with startDate from fromDate=${dateFilter.fromDate.toISOString()}\n`,
      );
    }

    const { historiesByUserId, allHistoryIds } = groupHistoriesByUserId(
      subscriptionHistoryDocs,
      dateFilter,
    );

    const {
      usedByHistoryId: usedPersistentFitPointByHistoryId,
      reservations,
      activities,
    } = await buildUsedPersistentFitPointContext(externalDb);

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

    let processedUserIds = 0;
    let createdCpUsers = 0;
    let existingCpUsers = 0;
    let createdMembershipPurchases = 0;
    let skippedMembershipPurchases = 0;
    let membershipPurchaseErrors = 0;
    let customersNotFound = 0;

    let createdCreditTransactions = 0;
    let creditTransactionErrors = 0;

    const purchasesToInsert: any[] = [];
    const creditTransactionsToInsert: any[] = [];

    const importedHistoryIds = new Set<string>();
    const activeImportedHistoryIds = new Set<string>();

    for (const [userId, histories] of historiesByUserId) {
      processedUserIds += 1;

      let customer =
        (await models.OneFitCustomer.findOne({ _id: userId })) ??
        (await models.OneFitCustomer.findOne({ onefit2UserId: userId }));

      customer = (await ensureOneFitCustomerForUserId(models, userId)) as
        | typeof customer
        | null;

      if (!customer) {
        customersNotFound += 1;
        continue;
      }

      const customerId = String(customer._id);

      let currentCreditBalance = 0;
      let totalCreditDeltaForUser = 0;
      let runningBalance = 0;
      let latestMembershipPlanId: string | undefined;
      let latestMembershipExpiresAt: Date | undefined;
      const now = new Date();

      try {
        for (const history of histories) {
          try {
            const result = processOneHistory(
              history,
              customerId,
              existingHistoryIds,
              usedPersistentFitPointByHistoryId,
              runningBalance,
              now,
              { includeExpired },
            );

            if (result.skip) {
              skippedMembershipPurchases += result.skipCount;
              continue;
            }

            importedHistoryIds.add(history._id);
            if (result.isActiveNow) {
              activeImportedHistoryIds.add(history._id);
            }

            runningBalance = result.newRunningBalance;
            if (result.creditTransactions?.length) {
              creditTransactionsToInsert.push(...result.creditTransactions);
              if (result.isActiveNow && result.creditDelta > 0) {
                totalCreditDeltaForUser += result.creditDelta;
              }
            }

            if (
              result.isActiveNow &&
              result.expiresAt &&
              (!latestMembershipExpiresAt ||
                result.expiresAt.getTime() >
                  latestMembershipExpiresAt.getTime())
            ) {
              latestMembershipPlanId = result.subscriptionId;
              latestMembershipExpiresAt = result.expiresAt;
            }

            purchasesToInsert.push(result.purchase);
          } catch (err: unknown) {
            const error = err as { message?: string };
            membershipPurchaseErrors += 1;
            process.stderr.write(
              `Error creating membership purchase for history ${
                history._id
              } and user ${userId}: ${error.message ?? error}\n`,
            );
          }
        }

        if (totalCreditDeltaForUser > 0) {
          const newBalance = currentCreditBalance + totalCreditDeltaForUser;
          await models.OneFitCustomer.updateCreditBalanceAndEarned(
            customerId,
            newBalance,
            totalCreditDeltaForUser,
          );
          currentCreditBalance = newBalance;
        }

        if (latestMembershipPlanId && latestMembershipExpiresAt) {
          await models.OneFitCustomer.updateMembership(
            customerId,
            latestMembershipPlanId,
            latestMembershipExpiresAt,
          );
        }

        const cpOutcome = await ensureClientPortalUser(
          CPUserModel as unknown as mongoose.Model<unknown>,
          clientPortalId,
          customer,
        );
        if (cpOutcome === 'existing') {
          existingCpUsers += 1;
        } else if (cpOutcome === 'created') {
          createdCpUsers += 1;
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        process.stderr.write(
          `Error processing user ${userId}: ${error.message ?? error}\n`,
        );
      }
    }

    const activityById = new Map<string, ExternalActivity>();
    for (const activity of activities) {
      activityById.set(activity._id, activity);
    }

    const bookingsToInsert: any[] = [];
    const activityTypeIdCache = new Map<string, string>();

    for (const r of reservations) {
      // Only create bookings for reservations whose subscription history
      // is currently active (isActiveNow === true).
      if (!activeImportedHistoryIds.has(r.historyId)) {
        continue;
      }

      const activity = activityById.get(r.activityId);
      if (!activity) {
        continue;
      }

      const providerId = extractIdFromPointer(activity._p_partner);
      const categoryId = extractIdFromPointer(activity._p_activitySubType);

      if (!providerId || !categoryId) {
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
          continue;
        }

        activityTypeId = String(activityType._id);
        activityTypeIdCache.set(cacheKey, activityTypeId);
      }

      const bookingDateRaw = toDate(activity.date);
      if (!bookingDateRaw) {
        continue;
      }

      const startMinutes =
        typeof activity.startTime === 'number' ? activity.startTime : 0;
      const endMinutes =
        typeof activity.endTime === 'number'
          ? activity.endTime
          : startMinutes + 60;

      const startTime = minutesToTimeString(startMinutes);
      const endTime = minutesToTimeString(endMinutes);

      const price =
        typeof activity.price === 'number' && !Number.isNaN(activity.price)
          ? activity.price
          : 0;

      const bookingEndDateTime = new Date(bookingDateRaw);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      bookingEndDateTime.setHours(endHour || 0, endMinute || 0, 0, 0);

      const now = new Date();
      const isPast = bookingEndDateTime < now;

      bookingsToInsert.push({
        _id: String(r.reservationId),
        userId: r.memberId,
        providerId,
        activityTypeId,
        bookingDate: bookingDateRaw,
        startTime,
        endTime,
        creditCost:
          typeof activity.fitPointPrice === 'number'
            ? activity.fitPointPrice
            : 0,
        price,
        status: isPast ? 'completed' : 'confirmed',
        attendanceStatus: isPast ? 'attended' : 'pending',
        attendedAt: isPast ? bookingEndDateTime : undefined,
        bookingId: r.reservationId,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
    }

    const purchaseResult = await insertBatched(
      models.MembershipPurchase.collection,
      purchasesToInsert,
      BATCH_SIZE,
      'membership purchases',
    );

    const creditResult = await insertBatched(
      models.CreditTransaction.collection,
      creditTransactionsToInsert,
      BATCH_SIZE,
      'credit transactions',
    );

    const bookingResult = await insertBatched(
      models.Booking.collection,
      bookingsToInsert,
      BATCH_SIZE,
      'bookings',
    );

    const stats: ImportStats = {
      processedUserIds,
      customersNotFound,
      createdCpUsers,
      existingCpUsers,
      createdMembershipPurchases: purchaseResult.inserted,
      skippedMembershipPurchases,
      membershipPurchaseErrors:
        membershipPurchaseErrors + purchaseResult.errors,
      createdCreditTransactions: creditResult.inserted,
      creditTransactionErrors: creditTransactionErrors + creditResult.errors,
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

  const dateFilter: SubscriptionDateFilter = {};

  const monthsBackRaw = process.env.SUBSCRIPTION_MONTHS_BACK?.trim();
  const monthsBack = monthsBackRaw ? Number(monthsBackRaw) : 1200;
  if (!Number.isNaN(monthsBack) && monthsBack > 0) {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - monthsBack);
    dateFilter.fromDate = fromDate;
  }

  const includeExpiredFlag =
    process.env.SUBSCRIPTION_INCLUDE_EXPIRED === 'true' ||
    process.env.IMPORT_OLD_PURCHASE_HISTORY === 'true';

  const importOptions: ImportOptions | undefined = includeExpiredFlag
    ? { includeExpired: true }
    : undefined;

  try {
    await importOnefit2SubscriptionHistory(
      externalUri,
      Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      importOptions,
    );
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
//   SUBSCRIPTION_MONTHS_BACK=N = only subscriptions with startDate within N months (default: 2)
//   SUBSCRIPTION_INCLUDE_EXPIRED=true or IMPORT_OLD_PURCHASE_HISTORY=true = include expired (old) purchase history
// Example: ONEFIT2_MONGO_URL=... SUBSCRIPTION_INCLUDE_EXPIRED=true pnpm tsx scripts/import-onefit2-subscription-history.ts
