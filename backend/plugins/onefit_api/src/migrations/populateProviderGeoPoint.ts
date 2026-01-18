const { MongoClient } = require('mongodb');
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/erxes?directConnection=true';

console.log(MONGO_URL, 'MONGO_URL');

if (!MONGO_URL) {
  throw new Error('MONGO_URL not provided');
}

const client = new MongoClient(MONGO_URL);

let db;

async function migrate() {
  await client.connect();
  db = client.db();

  const Providers = db.collection('onefit_providers');

  console.log('Starting migration to populate geoPoint for providers...\n');

  // Find all providers that have coordinates but are missing geoPoint
  const query = {
    'location.coordinates.lat': { $exists: true, $ne: null },
    'location.coordinates.lng': { $exists: true, $ne: null },
    $or: [
      { 'location.geoPoint': { $exists: false } },
      { 'location.geoPoint': null },
    ],
  };

  const providersCursor = Providers.find(query);
  const totalProviders = await Providers.countDocuments(query);

  console.log(`Found ${totalProviders} providers that need geoPoint populated\n`);

  let processedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for await (const provider of providersCursor) {
    processedCount++;

    const lat = provider.location?.coordinates?.lat;
    const lng = provider.location?.coordinates?.lng;

    if (!lat || !lng) {
      skippedCount++;
      console.log(
        `[${processedCount}/${totalProviders}] Skipping provider ${provider._id}: missing coordinates`,
      );
      continue;
    }

    const geoPoint = {
      type: 'Point',
      coordinates: [lng, lat], // Note: MongoDB GeoJSON uses [longitude, latitude]
    };

    try {
      const result = await Providers.updateOne(
        { _id: provider._id },
        {
          $set: {
            'location.geoPoint': geoPoint,
            modifiedAt: new Date(),
          },
        },
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(
          `[${processedCount}/${totalProviders}] ✅ Updated provider ${provider._id} (${provider.businessName?.en || 'Unnamed'})`,
        );
      } else {
        console.log(
          `[${processedCount}/${totalProviders}] ⚠️  Provider ${provider._id} was not modified`,
        );
      }
    } catch (error) {
      console.error(
        `[${processedCount}/${totalProviders}] ❌ Error updating provider ${provider._id}: ${error.message}`,
      );
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`Total providers processed: ${processedCount}`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`\nMigration completed at: ${new Date().toISOString()}`);

  console.log('\nMigration done ✅');
  process.exit(0);
}

// ---- Run ----
migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
