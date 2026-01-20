import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

/**
 * Collects unique category IDs from active activity-types for a provider
 */
function collectUniqueCategories(activityTypes: any[]): string[] {
  const categorySet = new Set<string>();

  for (const activityType of activityTypes) {
    if (activityType.categoryIds && Array.isArray(activityType.categoryIds)) {
      for (const categoryId of activityType.categoryIds) {
        if (categoryId && typeof categoryId === 'string') {
          categorySet.add(categoryId);
        }
      }
    }
  }

  // Sort for consistency
  return Array.from(categorySet).sort();
}

/**
 * Compares two arrays to check if they contain the same elements (order-independent)
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) {
      return false;
    }
  }

  return true;
}

async function updateProviderCategories(): Promise<void> {
  process.stdout.write('Starting provider category update...\n\n');

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  process.stdout.write('Querying all providers...\n');
  const providers = await models.Provider.find({});
  process.stdout.write(`Found ${providers.length} providers.\n\n`);

  let providersUpdated = 0;
  let providersSkipped = 0;
  let providersWithNoActiveActivities = 0;
  let errorCount = 0;

  process.stdout.write('Processing providers...\n');

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];

    // Progress reporting
    if ((i + 1) % 100 === 0 || i === providers.length - 1) {
      process.stdout.write(
        `Progress: ${i + 1}/${providers.length} (${Math.round(((i + 1) / providers.length) * 100)}%)\n`,
      );
    }

    try {
      // Find all active activity-types for this provider
      const activeActivityTypes = await models.ActivityType.find({
        providerId: provider._id,
        isActive: true,
      });

      // Collect unique category IDs from active activity-types
      const newCategoryIds = collectUniqueCategories(activeActivityTypes);

      // Handle providers with no active activity-types
      if (activeActivityTypes.length === 0) {
        providersWithNoActiveActivities++;
        
        // Set to empty array if provider has no active activity-types
        if (provider.categoryIds && provider.categoryIds.length > 0) {
          await models.Provider.updateProvider(provider._id, {
            categoryIds: [],
          });
          providersUpdated++;
          process.stdout.write(
            `  Provider ${provider._id}: No active activity-types, cleared categories\n`,
          );
        } else {
          providersSkipped++;
        }
        continue;
      }

      // Compare with existing categoryIds
      const existingCategoryIds = provider.categoryIds || [];
      const hasChanged = !arraysEqual(newCategoryIds, existingCategoryIds);

      if (hasChanged) {
        await models.Provider.updateProvider(provider._id, {
          categoryIds: newCategoryIds,
        });
        providersUpdated++;
        process.stdout.write(
          `  Provider ${provider._id}: Updated categories from [${existingCategoryIds.join(', ')}] to [${newCategoryIds.join(', ')}]\n`,
        );
      } else {
        providersSkipped++;
      }
    } catch (error: any) {
      errorCount++;
      process.stderr.write(
        `  Error processing provider ${provider._id}: ${error.message}\n`,
      );
    }
  }

  await closeMongooose();

  process.stdout.write('\n=== Update Summary ===\n');
  process.stdout.write(`Total providers processed: ${providers.length}\n`);
  process.stdout.write(`Providers updated: ${providersUpdated}\n`);
  process.stdout.write(`Providers skipped (no changes): ${providersSkipped}\n`);
  process.stdout.write(
    `Providers with no active activity-types: ${providersWithNoActiveActivities}\n`,
  );
  process.stdout.write(`Errors: ${errorCount}\n`);
}

async function main() {
  try {
    await updateProviderCategories();
    process.stdout.write('\nUpdate process completed successfully.\n');
  } catch (error: any) {
    process.stderr.write(`Error: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
