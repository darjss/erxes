import mongoose, { Connection } from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface ExternalSubscriptionDate {
  $date: string;
}

interface ExternalSubscription {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status?: number;
  fitPoint?: number;
  subType?: string;
  holdDuration?: number;
  _created_at?: ExternalSubscriptionDate;
  _updated_at?: ExternalSubscriptionDate;
}

interface ImportOptions {
  dryRun: boolean;
  limit?: number;
  onlyActive: boolean;
}

function parseBoolFlag(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.toLowerCase();

  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? undefined : parsed;
}

async function createExternalConnection(uri: string): Promise<Connection> {
  const connection = await mongoose.createConnection(uri).asPromise();

  return connection;
}

function mapSubscriptionToMembershipPlan(doc: ExternalSubscription) {
  const creditAmount = doc.fitPoint ?? 0;

  const isTopup = doc.subType === 'topup';

  const planType: 'normal' | 'credit' = isTopup ? 'credit' : 'normal';

  const gracePeriodDuration =
    typeof doc.holdDuration === 'number' && doc.holdDuration > 0
      ? doc.holdDuration
      : 7;

  const duration =
    typeof doc.duration === 'number' && doc.duration > 0
      ? doc.duration
      : undefined;

  const isActive = doc.status !== 0;

  return {
    name: doc.name,
    description: doc.description,
    price: doc.price,
    creditAmount,
    planType,
    duration,
    isActive,
    gracePeriodDuration,
  };
}

async function importSubscriptionsToMembershipPlans(
  externalUri: string,
  options: ImportOptions,
): Promise<void> {
  console.log('Starting import of subscriptions to membership plans...');

  if (!externalUri) {
    throw new Error(
      'External MongoDB URI for onefit2 is required (ONEFIT2_MONGO_URL or CLI argument)',
    );
  }

  console.log(`Connecting to external MongoDB (onefit2): ${externalUri}`);

  const externalConnection = await createExternalConnection(externalUri);

  try {
    const externalDb = externalConnection.db;

    if (!externalDb) {
      throw new Error('Failed to acquire external MongoDB database instance');
    }

    const query: Record<string, any> = {};

    if (options.onlyActive) {
      query.status = { $ne: 0 };
    }

    const cursor = externalDb.collection('Subscription').find(query);

    if (options.limit && options.limit > 0) {
      cursor.limit(options.limit);
    }

    const subscriptions: ExternalSubscription[] =
      (await cursor.toArray()) as unknown as ExternalSubscription[];

    console.log(`Found ${subscriptions.length} subscriptions to process`);

    await connect();
    console.log('Connected to local MongoDB');

    const db: mongoose.Connection = mongoose.connection;
    const models: IModels = loadClasses(db);

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const subscription of subscriptions) {
      try {
        if (!subscription.name) {
          skippedCount++;
          continue;
        }

        const mapped = mapSubscriptionToMembershipPlan(subscription);

        const existingById = await models.MembershipPlan.findOne({
          _id: subscription._id,
        });

        const existing =
          existingById ??
          (await models.MembershipPlan.findOne({
            name: mapped.name,
            planType: mapped.planType,
          }));

        if (options.dryRun) {
          if (existing) {
            updatedCount++;
          } else {
            createdCount++;
          }

          continue;
        }

        if (existing) {
          await models.MembershipPlan.updatePlan(existing._id, mapped);
          updatedCount++;
        } else {
          await models.MembershipPlan.createPlan({
            ...mapped,
            // Preserve original Subscription ID on the MembershipPlan document
            _id: subscription._id,
          } as any);
          createdCount++;
        }
      } catch (error: any) {
        errorCount++;
        console.error(
          `Error processing subscription ${subscription._id}:`,
          error.message || error,
        );
      }
    }

    console.log('\n=== Subscription Import Summary ===');
    console.log(`Total subscriptions processed: ${subscriptions.length}`);
    console.log(`MembershipPlans created: ${createdCount}`);
    console.log(`MembershipPlans updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('\nImport completed!');
  } finally {
    await externalConnection.close();
    await closeMongooose();
  }
}

async function main() {
  const externalUri = process.env.ONEFIT2_MONGO_URL;
  const dryRun = parseBoolFlag(process.env.DRY_RUN);
  const onlyActive = parseBoolFlag(process.env.ONLY_ACTIVE);
  const limit = parseNumber(process.env.LIMIT);

  if (!externalUri) {
    throw new Error('ONEFIT2_MONGO_URL environment variable is required');
  }

  try {
    await importSubscriptionsToMembershipPlans(externalUri, {
      dryRun,
      onlyActive,
      limit,
    });
  } catch (error: any) {
    process.stderr.write(
      `Subscription import failed: ${error.message || error}\n`,
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

// ONEFIT2_MONGO_URL=mongodb://localhost:27017/onefit2 pnpm tsx scripts/import-subscriptions-to-membership-plans.ts
