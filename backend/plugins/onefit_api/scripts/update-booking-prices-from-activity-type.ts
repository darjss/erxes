import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface BookingPriceRow {
  _id: string;
  activityTypeId: string;
  price?: number | null;
}

interface Args {
  dryRun: boolean;
  includeMissingPrice: boolean;
  limit?: number;
  batchSize: number;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    dryRun: false,
    includeMissingPrice: false,
    batchSize: 500,
  };

  for (const raw of argv) {
    const arg = raw.trim();

    if (arg === '--') continue;

    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (arg === '--include-missing') {
      args.includeMissingPrice = true;
      continue;
    }

    if (arg.startsWith('--limit=')) {
      const value = Number(arg.split('=')[1]);
      if (Number.isFinite(value) && value > 0) args.limit = value;
      continue;
    }

    if (arg.startsWith('--batch-size=')) {
      const value = Number(arg.split('=')[1]);
      if (Number.isFinite(value) && value > 0) args.batchSize = value;
      continue;
    }
  }

  return args;
}

async function updateBookingPricesFromActivityType(args: Args): Promise<void> {
  const bookingFilter = args.includeMissingPrice
    ? {
        $or: [
          { price: 0 },
          { price: { $exists: false } },
          { price: null },
        ],
      }
    : { price: 0 };

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  const activityTypeIds: string[] = await models.Booking.distinct(
    'activityTypeId',
    bookingFilter,
  );

  const activityTypes = await models.ActivityType.find({
    _id: { $in: activityTypeIds },
  })
    .select('_id price')
    .lean();

  const priceByActivityTypeId = new Map<string, number>(
    activityTypes.map((at) => [at._id.toString(), at.price ?? 0]),
  );

  const cursorQuery = models.Booking.find(bookingFilter)
    .select('_id activityTypeId price')
    .sort({ _id: 1 });

  if (args.limit) cursorQuery.limit(args.limit);

  const cursor = cursorQuery.cursor() as unknown as AsyncIterable<BookingPriceRow>;

  let matchedCount = 0;
  let missingActivityTypeCount = 0;
  let noOpCount = 0;
  let updatedCount = 0;

  const ops: Array<{
    updateOne: {
      filter: { _id: string };
      update: { $set: { price: number; modifiedAt: Date } };
    };
  }> = [];

  const flushOps = async () => {
    if (ops.length === 0) return;
    if (args.dryRun) {
      updatedCount += ops.length;
      ops.length = 0;
      return;
    }

    const result = await models.Booking.bulkWrite(ops, { ordered: false });
    // modifiedCount is good enough for our summary; bulkWrite type support varies by mongoose version.
    if ('modifiedCount' in result && typeof result.modifiedCount === 'number') {
      updatedCount += result.modifiedCount;
    } else {
      updatedCount += ops.length;
    }
    ops.length = 0;
  };

  try {
    for await (const booking of cursor) {
      matchedCount++;

      const nextPrice = priceByActivityTypeId.get(booking.activityTypeId);
      if (nextPrice === undefined) {
        missingActivityTypeCount++;
        continue;
      }

      const currentPrice = typeof booking.price === 'number' ? booking.price : 0;
      if (currentPrice === nextPrice) {
        noOpCount++;
        continue;
      }

      ops.push({
        updateOne: {
          filter: { _id: booking._id },
          update: { $set: { price: nextPrice, modifiedAt: new Date() } },
        },
      });

      if (ops.length >= args.batchSize) {
        await flushOps();
      }
    }

    await flushOps();
    process.stdout.write(
      [
        'Booking price update summary',
        `Matched bookings: ${matchedCount}`,
        `Updated bookings: ${updatedCount}`,
        `No-op bookings (already correct): ${noOpCount}`,
        `Missing activity types (could not compute price): ${missingActivityTypeCount}`,
        `Mode: ${args.dryRun ? 'dry-run' : 'live'}`,
      ].join('\n') + '\n',
    );
  } finally {
    await closeMongooose();
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  await updateBookingPricesFromActivityType(args);
}

main().catch((error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Update failed: ${msg}\n`);
  process.exit(1);
});

