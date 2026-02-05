import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

function cityKey(en: string, mn: string): string {
  return `${(en || '').trim()}|${(mn || '').trim()}`;
}

function districtKey(cityId: string, en: string, mn: string): string {
  return `${cityId}|${(en || '').trim()}|${(mn || '').trim()}`;
}

function slug(str: string): string {
  return (
    (str || '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'unnamed'
  );
}

async function seedCitiesAndDistricts(): Promise<void> {
  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  const providers = await models.Provider.find(
    {},
    { 'location.city': 1, 'location.district': 1 },
  ).lean();

  const citiesMap = new Map<string, { en: string; mn: string }>();
  for (const p of providers) {
    const loc = p as {
      location?: {
        city?: { en?: string; mn?: string };
        district?: { en?: string; mn?: string };
      };
    };
    const city = loc?.location?.city;
    if (city && (city.en?.trim() || city.mn?.trim())) {
      const en = (city.en || '').trim() || (city.mn || '').trim();
      const mn = (city.mn || '').trim() || en;
      citiesMap.set(cityKey(en, mn), { en, mn });
    }
  }

  let citiesCreated = 0;
  const cityIdByKey = new Map<string, string>();

  for (const [, name] of citiesMap) {
    const existing = await models.City.findOne({
      'name.en': name.en,
      'name.mn': name.mn,
    }).lean();
    if (existing) {
      cityIdByKey.set(cityKey(name.en, name.mn), existing._id.toString());
      continue;
    }
    const created = await models.City.create({
      name: { en: name.en, mn: name.mn },
      code: slug(name.en),
      isActive: true,
    });
    cityIdByKey.set(cityKey(name.en, name.mn), created._id.toString());
    citiesCreated += 1;
  }

  const districtsMap = new Map<
    string,
    { cityId: string; en: string; mn: string }
  >();
  for (const p of providers) {
    const loc = p as {
      location?: {
        city?: { en?: string; mn?: string };
        district?: { en?: string; mn?: string };
      };
    };
    const city = loc?.location?.city;
    const district = loc?.location?.district;
    if (!city || !district) continue;
    const cityEn = (city.en || '').trim() || (city.mn || '').trim();
    const cityMn = (city.mn || '').trim() || cityEn;
    const cid = cityIdByKey.get(cityKey(cityEn, cityMn));
    if (!cid) continue;
    const en = (district.en || '').trim() || (district.mn || '').trim();
    const mn = (district.mn || '').trim() || en;
    if (!en && !mn) continue;
    const dKey = districtKey(cid, en, mn);
    if (!districtsMap.has(dKey)) {
      districtsMap.set(dKey, { cityId: cid, en, mn });
    }
  }

  let districtsCreated = 0;
  for (const [, doc] of districtsMap) {
    const existing = await models.District.findOne({
      cityId: doc.cityId,
      'name.en': doc.en,
      'name.mn': doc.mn,
    }).lean();
    if (existing) continue;
    await models.District.create({
      cityId: doc.cityId,
      name: { en: doc.en, mn: doc.mn },
      code: slug(doc.en),
      isActive: true,
    });
    districtsCreated += 1;
  }

  await closeMongooose();

  process.stdout.write(
    `Seed completed. Cities: ${citiesCreated} created, ${cityIdByKey.size} total. Districts: ${districtsCreated} created, ${districtsMap.size} total.\n`,
  );
}

async function main() {
  try {
    await seedCitiesAndDistricts();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Seed failed: ${message}\n`);
    if (error instanceof Error && error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
