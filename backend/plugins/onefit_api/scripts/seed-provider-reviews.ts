import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import { ProviderStatus } from '../src/modules/provider/@types/provider';

const SAMPLE_COMMENTS = [
  'Great facility and friendly staff.',
  'Classes are well organized. Will come back.',
  'Clean space and good equipment.',
  'Enjoyed the session. Booking was easy.',
  'Solid experience overall.',
  'Nice location and atmosphere.',
  'Helpful instructors.',
  'Good value for credits.',
  'Would recommend to friends.',
  'Five stars — exceeded expectations.',
  'Room for improvement on scheduling, but good workouts.',
  'Love the morning slots.',
];

const SAMPLE_RATINGS = [5, 4, 5, 4, 3, 5, 4, 4, 5, 4, 3, 5];

interface ParsedArgs {
  providerId?: string;
  count: number;
  dryRun: boolean;
}

function parseArgs(): ParsedArgs {
  const out: ParsedArgs = {
    count: 8,
    dryRun: false,
  };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--providerId=')) {
      out.providerId = arg.slice('--providerId='.length).trim();
    } else if (arg.startsWith('--count=')) {
      const n = parseInt(arg.slice('--count='.length), 10);
      if (!Number.isNaN(n) && n > 0) {
        out.count = Math.min(n, 200);
      }
    } else if (arg === '--dry-run') {
      out.dryRun = true;
    }
  }
  return out;
}

async function resolveProviderId(
  models: IModels,
  explicit?: string,
): Promise<string | null> {
  if (explicit) {
    const found = await models.Provider.findOne({ _id: explicit }).lean();
    return found ? String(found._id) : null;
  }
  const approved = await models.Provider.findOne({
    status: ProviderStatus.APPROVED,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();
  if (approved) {
    return String(approved._id);
  }
  const fallback = await models.Provider.findOne({})
    .sort({ createdAt: -1 })
    .lean();
  return fallback ? String(fallback._id) : null;
}

async function resolveUserIds(
  models: IModels,
  count: number,
): Promise<string[]> {
  const rows = await models.OneFitCustomer.find({})
    .limit(count)
    .select({ _id: 1 })
    .lean();
  const ids = rows.map((r) => String(r._id));
  if (ids.length >= count) {
    return ids.slice(0, count);
  }
  const short = count - ids.length;
  for (let i = 0; i < short; i += 1) {
    ids.push(new mongoose.Types.ObjectId().toHexString());
  }
  return ids.slice(0, count);
}

async function seedProviderReviews(): Promise<void> {
  const { providerId: argProviderId, count, dryRun } = parseArgs();

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models = loadClasses(db);

  const providerId = await resolveProviderId(models, argProviderId);
  if (!providerId) {
    await closeMongooose();
    throw new Error(
      'No provider found. Create a provider first or pass --providerId=<id>.',
    );
  }

  const userIds = await resolveUserIds(models, count);

  if (dryRun) {
    await closeMongooose();
    process.stdout.write(
      `Dry run: would insert ${count} reviews for providerId=${providerId} (${userIds.length} user id(s), some may be synthetic).\n`,
    );
    return;
  }

  let created = 0;
  for (let i = 0; i < count; i += 1) {
    const rating = SAMPLE_RATINGS[i % SAMPLE_RATINGS.length];
    const comment = SAMPLE_COMMENTS[i % SAMPLE_COMMENTS.length];
    const userId = userIds[i % userIds.length];

    await models.ProviderReview.createProviderReview({
      providerId,
      userId,
      rating,
      comment,
    });
    created += 1;
  }

  const summary = await models.ProviderReview.getSummaryForProvider(providerId);

  await closeMongooose();

  process.stdout.write(
    `Inserted ${created} test review(s) for providerId=${providerId}. ` +
      `Summary: averageRating=${summary.averageRating.toFixed(2)}, reviewCount=${summary.reviewCount}.\n`,
  );
}

async function main() {
  try {
    await seedProviderReviews();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`seed-provider-reviews failed: ${message}\n`);
    if (error instanceof Error && error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
