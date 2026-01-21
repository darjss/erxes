import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { IModels, loadClasses } from '../src/connectionResolvers';

interface Summary {
  totalActivityTypes: number;
  processed: number;
  updated: number;
  skippedNoProvider: number;
  skippedNoCovers: number;
  skippedHasImage: number;
}

function getRandomItemExcluding<T>(items: T[], excluded: Set<T>): T | null {
  if (!items.length) {
    return null;
  }

  const available = items.filter(item => !excluded.has(item));

  if (available.length === 0) {
    // All images are already used; fall back to any random one
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

async function setActivityTypeImages(): Promise<void> {
  process.stdout.write('Connecting to MongoDB...\n');
  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  process.stdout.write('Loading activity types...\n');

  // Only activity types that do not yet have an image
  const activityTypes = await models.ActivityType.find({
    $or: [{ image: { $exists: false } }, { image: null }, { image: '' }],
  });

  const summary: Summary = {
    totalActivityTypes: activityTypes.length,
    processed: 0,
    updated: 0,
    skippedNoProvider: 0,
    skippedNoCovers: 0,
    skippedHasImage: 0,
  };

  process.stdout.write(
    `Found ${summary.totalActivityTypes} activity types without image.\n`,
  );

  // Track used image URLs per provider to avoid local duplicates
  const usedImagesPerProvider = new Map<string, Set<string>>();

  for (let i = 0; i < activityTypes.length; i++) {
    const activityType: any = activityTypes[i];
    summary.processed += 1;

    if ((i + 1) % 100 === 0 || i === activityTypes.length - 1) {
      process.stdout.write(
        `Progress: ${i + 1}/${activityTypes.length} (${Math.round(
          ((i + 1) / activityTypes.length) * 100,
        )}%)\n`,
      );
    }

    // Extra guard: skip if image is already set for some reason
    if (activityType.image) {
      summary.skippedHasImage += 1;
      continue;
    }

    const providerId: string | undefined = activityType.providerId;
    if (!providerId) {
      summary.skippedNoProvider += 1;
      continue;
    }

    const provider = await models.Provider.findOne({ _id: providerId });
    if (!provider) {
      summary.skippedNoProvider += 1;
      continue;
    }

    const coverImages: string[] = Array.isArray((provider as any).coverImages)
      ? ((provider as any).coverImages as string[]).filter(Boolean)
      : [];

    if (!coverImages.length) {
      summary.skippedNoCovers += 1;
      continue;
    }

    // Get or create the set of used images for this provider
    if (!usedImagesPerProvider.has(providerId)) {
      usedImagesPerProvider.set(providerId, new Set<string>());
    }
    const usedImages = usedImagesPerProvider.get(providerId)!;

    const chosenImage = getRandomItemExcluding(coverImages, usedImages);

    if (!chosenImage) {
      summary.skippedNoCovers += 1;
      continue;
    }

    await models.ActivityType.updateActivityType(activityType._id, {
      image: chosenImage,
    });

    usedImages.add(chosenImage);
    summary.updated += 1;
  }

  await closeMongooose();

  process.stdout.write('\n=== Activity Type Image Assignment Summary ===\n');
  process.stdout.write(
    `Total activity types without image: ${summary.totalActivityTypes}\n`,
  );
  process.stdout.write(`Processed: ${summary.processed}\n`);
  process.stdout.write(`Updated with image: ${summary.updated}\n`);
  process.stdout.write(
    `Skipped (no provider or provider missing): ${summary.skippedNoProvider}\n`,
  );
  process.stdout.write(
    `Skipped (provider has no cover images): ${summary.skippedNoCovers}\n`,
  );
  process.stdout.write(
    `Skipped (already had image): ${summary.skippedHasImage}\n`,
  );
}

async function main() {
  try {
    await setActivityTypeImages();
    process.stdout.write('\nDone setting activity type images.\n');
  } catch (error: any) {
    process.stderr.write(`Error: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  // Example:
  //   pnpm tsx backend/plugins/onefit_api/scripts/set-activity-type-images.ts
  void main();
}

