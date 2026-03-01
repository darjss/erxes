import mongoose from 'mongoose';
import { cpUserSchema } from 'erxes-api-shared/core-modules';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import {
  CreditSource,
  CreditTransactionType,
} from '@/membership/@types/credittransaction';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface ExternalDate {
  $date: string;
}

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

/** Onefit2 Activity: holds credit cost per reservation. */
interface ExternalActivity {
  _id: string;
  fitPointPrice?: number;
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

function passesDateFilter(
  history: ExternalSubscriptionHistory,
  filter?: SubscriptionDateFilter,
): boolean {
  const start = history.startDate ? new Date(history.startDate) : undefined;
  const end = history.endDate ? new Date(history.endDate) : undefined;

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

const BATCH_SIZE = 5000;

async function importOnefit2SubscriptionHistory(
  externalUri: string,
  dateFilter?: SubscriptionDateFilter,
): Promise<void> {
  process.stdout.write('Starting import of Onefit2 subscription history...\n');

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

    const historiesByUserId = new Map<string, ExternalSubscriptionHistory[]>();
    const allHistoryIds: string[] = [];

    for (const history of subscriptionHistoryDocs) {
      if (!passesDateFilter(history, dateFilter)) {
        continue;
      }

      const memberId = extractIdFromPointer(history._p_member);

      if (!memberId) {
        continue;
      }

      if (!historiesByUserId.has(memberId)) {
        historiesByUserId.set(memberId, []);
      }

      historiesByUserId.get(memberId)!.push(history);
      allHistoryIds.push(history._id);
    }

    // Build usedPersistentFitPoint from Reservations (status=0) and their Activity credits
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
      const credit = typeof a.fitPointPrice === 'number' ? a.fitPointPrice : 0;
      activityCreditById.set(a._id, credit);
    }
    const usedPersistentFitPointByHistoryId = new Map<string, number>();
    for (const r of reservations) {
      const historyId = extractIdFromPointer(r._p_subscriptionHistory);
      const activityId = extractIdFromPointer(r._p_activity);
      if (!historyId || !activityId) continue;
      const credit = activityCreditById.get(activityId) ?? 0;
      usedPersistentFitPointByHistoryId.set(
        historyId,
        (usedPersistentFitPointByHistoryId.get(historyId) ?? 0) + credit,
      );
    }
    process.stdout.write(
      `Computed usedPersistentFitPoint from ${reservations.length} reservations (status=0) and ${activityDocs.length} activities\n`,
    );

    await connect();
    process.stdout.write('Connected to local MongoDB\n');

    const db: mongoose.Connection = mongoose.connection;
    const models: IModels = loadClasses(db);

    const existingHistoryIds = new Set<string>();

    if (allHistoryIds.length > 0) {
      const existingPurchases = await models.MembershipPurchase.find(
        { externalHistoryId: { $in: allHistoryIds } },
        { externalHistoryId: 1 },
      ).lean();

      for (const purchase of existingPurchases) {
        const row = purchase as Record<string, unknown>;
        if (row.externalHistoryId) {
          existingHistoryIds.add(String(row.externalHistoryId));
        }
      }

      process.stdout.write(
        `Existing membership purchases with externalHistoryId: ${existingHistoryIds.size}\n`,
      );
    }

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

    for (const [userId, histories] of historiesByUserId) {
      processedUserIds += 1;

      let customer = await models.OneFitCustomer.findOne({ _id: userId });
      if (!customer) {
        customer = await models.OneFitCustomer.findOne({
          onefit2UserId: userId,
        });
      }

      if (!customer) {
        customersNotFound += 1;
        continue;
      }

      const customerId = String(customer._id);
      const email =
        customer.primaryEmail || (customer.emails && customer.emails[0]);
      const phone =
        customer.primaryPhone || (customer.phones && customer.phones[0]);

      let currentCreditBalance = 0;
      let totalCreditDeltaForUser = 0;
      let runningBalance = currentCreditBalance;
      let latestMembershipPlanId: string | undefined;
      let latestMembershipExpiresAt: Date | undefined;

      try {
        for (const history of histories) {
          try {
            const historyId = history._id;

            if (history.status !== 1) {
              skippedMembershipPurchases += 1;
              continue;
            }

            if (existingHistoryIds.has(historyId)) {
              skippedMembershipPurchases += 1;
              continue;
            }

            const subscriptionId = extractIdFromPointer(
              history._p_subscription,
            );

            if (!subscriptionId) {
              skippedMembershipPurchases += 1;
              continue;
            }

            const start =
              history.startDate && history.startDate instanceof Date
                ? history.startDate
                : history.startDate
                  ? new Date(history.startDate)
                  : undefined;
            const end =
              history.endDate && history.endDate instanceof Date
                ? history.endDate
                : history.endDate
                  ? new Date(history.endDate)
                  : undefined;

            const now = new Date();

            if (!start || !end) {
              skippedMembershipPurchases += 1;
              continue;
            }

            const isActiveNow = start <= now && end >= now;

            // Skip fully expired histories (past-only); import active and future
            if (!isActiveNow && end < now) {
              skippedMembershipPurchases += 1;
              continue;
            }

            const amount =
              typeof history.price === 'number' ? history.price : 0;
            const purchasedAt =
              history._created_at || history.startDate || new Date();
            const expiresAt = history.endDate;

            const persistent =
              typeof history.persistentFitPoint === 'number'
                ? history.persistentFitPoint
                : 0;
            const expirableFitPoint =
              typeof history.expirableFitPoint === 'number'
                ? history.expirableFitPoint
                : 0;

            // Use reservation-based used credits (status=0 reservations → Activity credits) when available
            const usedPersistent = usedPersistentFitPointByHistoryId.has(
              historyId,
            )
              ? usedPersistentFitPointByHistoryId.get(historyId)!
              : typeof history.usedPersistentFitPoint === 'number'
                ? history.usedPersistentFitPoint
                : 0;
            const creditDelta = persistent + expirableFitPoint - usedPersistent;

            if (isActiveNow && creditDelta > 0) {
              totalCreditDeltaForUser += creditDelta;
              runningBalance += creditDelta;

              creditTransactionsToInsert.push({
                _id: `${historyId}-${customerId}-${purchasedAt.getTime()}`,
                userId: customerId,
                amount: creditDelta,
                transactionType: CreditTransactionType.PURCHASE,
                source: CreditSource.INDIVIDUAL,
                description: 'Imported credits from Onefit2 subscription',
                balanceAfter: runningBalance,
                createdAt: purchasedAt,
              });
            }

            if (
              isActiveNow &&
              expiresAt &&
              (!latestMembershipExpiresAt ||
                expiresAt.getTime() > latestMembershipExpiresAt.getTime())
            ) {
              latestMembershipPlanId = subscriptionId;
              latestMembershipExpiresAt = expiresAt;
            }

            const purchasePayload: any = {
              _id: historyId,
              userId: customerId,
              planId: subscriptionId,
              status: 'paid',
              activatedAt: isActiveNow ? purchasedAt : undefined,
              purchasedAt,
              expiresAt,
              amount,
              externalHistoryId: historyId,
            };

            purchasesToInsert.push({
              ...purchasePayload,
              createdAt: new Date(),
            });
          } catch (error: any) {
            membershipPurchaseErrors += 1;
            process.stderr.write(
              `Error creating membership purchase for history ${
                history._id
              } and user ${userId}: ${error.message || error}\n`,
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

        if (!email && !phone) {
          continue;
        }

        const cpUserByCustomer = await CPUserModel.findOne({
          clientPortalId,
          erxesCustomerId: customerId,
        }).lean();

        let cpUser = cpUserByCustomer;

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
          existingCpUsers += 1;
          continue;
        }

        const now = new Date();

        await CPUserModel.create({
          type: 'customer',
          clientPortalId,
          erxesCustomerId: customerId,
          email,
          phone,
          username: email || phone || customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          isVerified: true,
          isEmailVerified: !!email,
          isPhoneVerified: !!phone,
          createdAt: now,
          updatedAt: now,
        });

        createdCpUsers += 1;
      } catch (error: any) {
        process.stderr.write(
          `Error processing user ${userId}: ${error.message || error}\n`,
        );
      }
    }

    const purchasesCollection = models.MembershipPurchase.collection;

    if (purchasesToInsert.length > 0) {
      process.stdout.write(
        `Bulk inserting ${purchasesToInsert.length} membership purchases (batch size ${BATCH_SIZE})...\n`,
      );
      for (let i = 0; i < purchasesToInsert.length; i += BATCH_SIZE) {
        const batch = purchasesToInsert.slice(i, i + BATCH_SIZE);
        try {
          await purchasesCollection.insertMany(batch, { ordered: false });
          createdMembershipPurchases += batch.length;
          process.stdout.write(
            `  Inserted ${Math.min(
              i + BATCH_SIZE,
              purchasesToInsert.length,
            )} / ${purchasesToInsert.length}\n`,
          );
        } catch (error: any) {
          if (error.writeErrors) {
            const inserted = error.insertedIds
              ? Object.keys(error.insertedIds).length
              : 0;
            createdMembershipPurchases += inserted;
            membershipPurchaseErrors += error.writeErrors.length;
            process.stderr.write(
              `  Batch insert partial success: ${inserted} inserted, ${error.writeErrors.length} errors (e.g. duplicates)\n`,
            );
          } else {
            membershipPurchaseErrors += 1;
            throw error;
          }
        }
      }
    }

    const creditTransactionsCollection = models.CreditTransaction.collection;

    if (creditTransactionsToInsert.length > 0) {
      process.stdout.write(
        `Bulk inserting ${creditTransactionsToInsert.length} credit transactions (batch size ${BATCH_SIZE})...\n`,
      );
      for (let i = 0; i < creditTransactionsToInsert.length; i += BATCH_SIZE) {
        const batch = creditTransactionsToInsert.slice(i, i + BATCH_SIZE);
        try {
          await creditTransactionsCollection.insertMany(batch, {
            ordered: false,
          });
          createdCreditTransactions += batch.length;
          process.stdout.write(
            `  Inserted ${Math.min(
              i + BATCH_SIZE,
              creditTransactionsToInsert.length,
            )} / ${creditTransactionsToInsert.length}\n`,
          );
        } catch (error: any) {
          if (error.writeErrors) {
            const inserted = error.insertedIds
              ? Object.keys(error.insertedIds).length
              : 0;
            createdCreditTransactions += inserted;
            creditTransactionErrors += error.writeErrors.length;
            process.stderr.write(
              `  Credit batch partial success: ${inserted} inserted, ${error.writeErrors.length} errors (e.g. duplicates)\n`,
            );
          } else {
            creditTransactionErrors += 1;
            throw error;
          }
        }
      }
    }

    process.stdout.write(
      '\n=== Onefit2 Subscription History Import Summary ===\n',
    );
    process.stdout.write(
      `User ids with history processed: ${processedUserIds}\n`,
    );
    process.stdout.write(
      `Customers not found (run user import first): ${customersNotFound}\n`,
    );
    process.stdout.write(`Client portal users created: ${createdCpUsers}\n`);
    process.stdout.write(
      `Existing client portal users matched: ${existingCpUsers}\n`,
    );
    process.stdout.write(
      `Membership purchases created: ${createdMembershipPurchases}\n`,
    );
    process.stdout.write(
      `Membership purchases skipped (already existed or invalid): ${skippedMembershipPurchases}\n`,
    );
    process.stdout.write(
      `Membership purchases errors: ${membershipPurchaseErrors}\n`,
    );
    process.stdout.write(
      `Credit transactions created: ${createdCreditTransactions}\n`,
    );
    process.stdout.write(
      `Credit transactions errors: ${creditTransactionErrors}\n`,
    );
    process.stdout.write('Import completed.\n');
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
  const monthsBack = monthsBackRaw ? Number(monthsBackRaw) : 2;
  if (!Number.isNaN(monthsBack) && monthsBack > 0) {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - monthsBack);
    dateFilter.fromDate = fromDate;
  }

  try {
    await importOnefit2SubscriptionHistory(
      externalUri,
      Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
    );
  } catch (error: any) {
    process.stderr.write(
      `Onefit2 subscription history import failed: ${error.message || error}\n`,
    );
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

// Run user import first: pnpm tsx scripts/import-onefit2-users.ts
// Optional: SUBSCRIPTION_ACTIVE_NOW=true = only subscriptions active on current date
// Example: ONEFIT2_MONGO_URL=... SUBSCRIPTION_ACTIVE_NOW=true pnpm tsx scripts/import-onefit2-subscription-history.ts
