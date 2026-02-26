import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface ExternalNumberLong {
  $numberLong: string;
}

interface PartnerActivity {
  _id: string;
  _p_partner: string;
  _p_activitySubType: string;
  price: number | ExternalNumberLong;
}

function extractParsePointerId(pointer: string): string | null {
  if (!pointer || typeof pointer !== 'string') {
    return null;
  }

  const parts = pointer.split('$');
  if (parts.length !== 2) {
    return null;
  }

  return parts[1];
}

function toNumber(value: number | ExternalNumberLong | undefined): number {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object' && value.$numberLong) {
    const parsed = Number(value.$numberLong);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
}

async function updateActivityTypePrices(
  partnerActivityJsonPath: string,
): Promise<void> {
  console.log('Starting activity type price update...');

  if (!fs.existsSync(partnerActivityJsonPath)) {
    throw new Error(`JSON file not found: ${partnerActivityJsonPath}`);
  }

  const fileContent = fs.readFileSync(partnerActivityJsonPath, 'utf-8');
  const partnerActivities: PartnerActivity[] = JSON.parse(fileContent);

  if (!Array.isArray(partnerActivities)) {
    throw new Error(
      'JSON file must contain an array of PartnerActivity objects',
    );
  }

  console.log(
    `Found ${partnerActivities.length} partner activities to process`,
  );

  await connect();
  console.log('Connected to MongoDB');

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const processedKeys = new Set<string>();

  for (const partnerActivity of partnerActivities) {
    try {
      const providerId = extractParsePointerId(partnerActivity._p_partner);
      const categoryId = extractParsePointerId(
        partnerActivity._p_activitySubType,
      );

      if (!providerId) {
        skippedCount++;
        continue;
      }

      if (!categoryId) {
        skippedCount++;
        continue;
      }

      const uniqueKey = `${providerId}:${categoryId}`;

      if (processedKeys.has(uniqueKey)) {
        continue;
      }

      processedKeys.add(uniqueKey);

      const provider = await models.Provider.findOne({ _id: providerId });
      if (!provider) {
        skippedCount++;
        continue;
      }

      const existing = await models.ActivityType.findOne({
        providerId,
        categoryIds: { $all: [categoryId] },
      });

      if (!existing) {
        skippedCount++;
        continue;
      }

      const price = toNumber(partnerActivity.price);
      await models.ActivityType.updateActivityType(existing._id, { price });
      updatedCount++;
    } catch (error: any) {
      errorCount++;
      console.error(
        `Error processing partner activity ${partnerActivity._id}:`,
        error.message,
      );
    }
  }

  await closeMongooose();

  console.log('\n=== Price Update Summary ===');
  console.log(
    `Total partner activities processed: ${partnerActivities.length}`,
  );
  console.log(`ActivityTypes updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('\nUpdate completed!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    process.stderr.write(
      'Usage: npm run update:activity-type-prices <partner-activity-json-path>\n',
    );
    process.stderr.write(
      '   or: tsx scripts/update-activity-type-prices.ts <partner-activity-json-path>\n',
    );
    process.exit(1);
  }

  const partnerActivityJsonPath = path.resolve(args[0]);

  try {
    await updateActivityTypePrices(partnerActivityJsonPath);
  } catch (error: any) {
    process.stderr.write(`Update failed: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
