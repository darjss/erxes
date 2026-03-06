/**
 * Recompute each OneFitCustomer's currentCreditBalance, totalCreditsEarned, and
 * totalCreditsUsed from the credit transaction ledger. Use after imports or
 * when customer balance may have drifted from transactions.
 *
 * Environment: MONGO_URL (erxes MongoDB)
 *
 * Usage:
 *   pnpm tsx backend/plugins/onefit_api/scripts/recompute-customer-credit-from-transactions.ts
 *   pnpm tsx backend/plugins/onefit_api/scripts/recompute-customer-credit-from-transactions.ts --dry-run
 *
 * --dry-run  Compare current customer fields with values from transactions; report differences only (no updates).
 */

import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import {
  recomputeOneFitCustomerCreditFields,
  computeEarnedAndUsedFromTransactions,
} from '@/membership/graphql/resolvers/utils/creditTransactionUtils';

const LOG_EVERY = 500;
const DRY_RUN_SAMPLE_MAX = 20;

function isDryRun(): boolean {
  return process.argv.includes('--dry-run');
}

interface CreditDiff {
  userId: string;
  currentCreditBalance: number;
  computedBalance: number;
  totalCreditsEarned: number;
  computedEarned: number;
  totalCreditsUsed: number;
  computedUsed: number;
}

async function runDryRun(models: IModels): Promise<void> {
  const customerIds = await models.OneFitCustomer.find()
    .select({ _id: 1 })
    .lean()
    .then((docs) => docs.map((d) => String(d._id)));

  process.stdout.write(
    `Dry run: Found ${customerIds.length} OneFitCustomer(s). Comparing with credit transactions...\n`,
  );

  const diffs: CreditDiff[] = [];
  let errors = 0;

  for (const userId of customerIds) {
    try {
      const oneFitCustomer =
        await models.OneFitCustomer.getOneFitCustomer(userId);
      if (!oneFitCustomer) {
        continue;
      }

      const balance =
        await models.CreditTransaction.getUserBalance(userId);
      const transactions = await models.CreditTransaction.find({
        userId,
      });
      const { totalCreditsEarned: computedEarned, totalCreditsUsed: computedUsed } =
        computeEarnedAndUsedFromTransactions(transactions);

      const currentBalance = oneFitCustomer.currentCreditBalance ?? 0;
      const currentEarned = oneFitCustomer.totalCreditsEarned ?? 0;
      const currentUsed = oneFitCustomer.totalCreditsUsed ?? 0;

      const hasDiff =
        currentBalance !== balance ||
        currentEarned !== computedEarned ||
        currentUsed !== computedUsed;

      if (hasDiff) {
        diffs.push({
          userId,
          currentCreditBalance: currentBalance,
          computedBalance: balance,
          totalCreditsEarned: currentEarned,
          computedEarned,
          totalCreditsUsed: currentUsed,
          computedUsed,
        });
      }
    } catch (err: unknown) {
      errors += 1;
      const e = err as { message?: string };
      process.stderr.write(
        `  Error for userId ${userId}: ${e.message ?? err}\n`,
      );
    }
  }

  process.stdout.write(
    `\n=== Dry run summary ===\n` +
      `Total customers: ${customerIds.length}\n` +
      `Would update: ${diffs.length}\n` +
      `Errors: ${errors}\n`,
  );

  if (diffs.length > 0) {
    const sample = diffs.slice(0, DRY_RUN_SAMPLE_MAX);
    process.stdout.write(
      `\nSample differences (first ${sample.length}):\n` +
        sample
          .map(
            (d) =>
              `  ${d.userId}: balance ${d.currentCreditBalance} -> ${d.computedBalance}, earned ${d.totalCreditsEarned} -> ${d.computedEarned}, used ${d.totalCreditsUsed} -> ${d.computedUsed}`,
          )
          .join('\n') + '\n',
    );
  }

  process.stdout.write('No changes applied. Run without --dry-run to update.\n');
}

async function run(): Promise<void> {
  const dryRun = isDryRun();

  await connect();
  process.stdout.write('Connected to MongoDB.\n');

  const db = mongoose.connection;
  const models: IModels = loadClasses(db);

  if (dryRun) {
    await runDryRun(models);
    await closeMongooose();
    return;
  }

  const customerIds = await models.OneFitCustomer.find()
    .select({ _id: 1 })
    .lean()
    .then((docs) => docs.map((d) => String(d._id)));

  process.stdout.write(
    `Found ${customerIds.length} OneFitCustomer(s). Recomputing from credit transactions...\n`,
  );

  let processed = 0;
  let errors = 0;

  for (const userId of customerIds) {
    try {
      await recomputeOneFitCustomerCreditFields(userId, models);
      processed += 1;
      if (processed % LOG_EVERY === 0) {
        process.stdout.write(
          `  Processed ${processed} / ${customerIds.length}\n`,
        );
      }
    } catch (err: unknown) {
      errors += 1;
      const e = err as { message?: string };
      process.stderr.write(
        `  Error for userId ${userId}: ${e.message ?? err}\n`,
      );
    }
  }

  process.stdout.write(
    `\n=== Summary ===\nProcessed: ${processed}, Errors: ${errors}, Total: ${customerIds.length}\nDone.\n`,
  );

  await closeMongooose();
}

async function main(): Promise<void> {
  try {
    await run();
  } catch (error: unknown) {
    const err = error as { message?: string; stack?: string };
    process.stderr.write(`Recompute failed: ${err.message ?? error}\n`);
    if (err.stack) process.stderr.write(`${err.stack}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
