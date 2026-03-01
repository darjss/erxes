const { MongoClient } = require('mongodb');
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/erxes?directConnection=true';

if (!MONGO_URL) {
  throw new Error('MONGO_URL not provided');
}

const client = new MongoClient(MONGO_URL);

async function migrate() {
  await client.connect();
  const db = client.db();

  const ActivityTypes = db.collection('onefit_activity_types');

  const query = {
    $or: [
      { cancellationDeadline: { $lt: 0 } },
      { cancellationDeadline: null },
      { cancellationDeadline: { $exists: false } },
    ],
  };

  const totalToUpdate = await ActivityTypes.countDocuments(query);
  console.log(
    `Found ${totalToUpdate} activity types with non-positive cancellation deadline\n`,
  );

  if (totalToUpdate === 0) {
    console.log('Nothing to update.');
    process.exit(0);
    return;
  }

  const result = await ActivityTypes.updateMany(query, [
    {
      $set: {
        cancellationDeadline: {
          $cond: {
            if: {
              $and: [
                { $ne: ['$cancellationDeadline', null] },
                { $lt: ['$cancellationDeadline', 0] },
              ],
            },
            then: { $abs: '$cancellationDeadline' },
            else: 0,
          },
        },
        modifiedAt: new Date(),
      },
    },
  ]);

  console.log('=== Migration Summary ===');
  console.log(`Matched: ${result.matchedCount}`);
  console.log(`Modified: ${result.modifiedCount}`);
  console.log(`\nMigration completed at: ${new Date().toISOString()}`);
  console.log('\nMigration done ✅');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
