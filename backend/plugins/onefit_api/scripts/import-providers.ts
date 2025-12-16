import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import {
  IProvider,
  ProviderStatus,
} from '../src/modules/provider/@types/provider';

interface ExternalDate {
  $date: string;
}

interface ExternalNumberLong {
  $numberLong: string;
}

interface ExternalProvider {
  _id: string;
  status: number;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  phone: string;
  email: string;
  facebook?: string;
  rateTotal?: ExternalNumberLong;
  category?: string;
  contactName?: string;
  categoryEn?: string;
  _created_at?: ExternalDate;
  _updated_at?: ExternalDate;
  rateCount?: ExternalNumberLong;
  districtEn?: string;
  location?: [number, number];
  address?: string;
  expiryDate?: ExternalDate;
  addressEn?: string;
  cityEn?: string;
  levelEn?: string;
  district?: string;
  level?: string;
  city?: string;
  amenities?: string[];
}

function toDate(value?: ExternalDate): Date | undefined {
  if (!value || !value.$date) {
    return undefined;
  }

  const date = new Date(value.$date);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toNumber(value?: ExternalNumberLong): number | undefined {
  if (!value || typeof value.$numberLong !== 'string') {
    return undefined;
  }

  const parsed = Number(value.$numberLong);

  return Number.isNaN(parsed) ? undefined : parsed;
}

function getMultilingual(mn?: string, en?: string): { mn: string; en: string } {
  const mnValue = mn && mn.trim().length > 0 ? mn.trim() : en?.trim() || '';
  const enValue = en && en.trim().length > 0 ? en.trim() : mnValue;

  return {
    mn: mnValue || enValue,
    en: enValue || mnValue,
  };
}

function mapStatus(status?: number): ProviderStatus {
  if (status === 1) {
    return ProviderStatus.APPROVED;
  }

  if (status === 0) {
    return ProviderStatus.PENDING;
  }

  return ProviderStatus.PENDING;
}

function mapExternalProviderToProvider(external: ExternalProvider): IProvider {
  const createdAt = toDate(external._created_at);
  const modifiedAt = toDate(external._updated_at);

  const businessName = getMultilingual(external.name, external.nameEn);
  const description = getMultilingual(
    external.description,
    external.descriptionEn,
  );

  const address = getMultilingual(external.address, external.addressEn);
  const city = getMultilingual(external.city, external.cityEn);

  const district =
    external.district || external.districtEn
      ? getMultilingual(external.district, external.districtEn)
      : undefined;

  const coordinates =
    external.location && external.location.length === 2
      ? {
          lat: external.location[1],
          lng: external.location[0],
        }
      : undefined;

  const facilities =
    external.amenities && external.amenities.length > 0
      ? external.amenities
      : undefined;

  const provider: IProvider = {
    businessName,
    description: description,
    location: {
      address,
      city,
      district,
      coordinates,
    },
    contactInfo: {
      phone: external.phone,
      email: external.email,
      website: external.facebook,
    },
    facilities,
    categoryIds: [],
    status: mapStatus(external.status),
    isActive: true,
    createdAt,
    modifiedAt,
  };

  return provider;
}

async function importProviders(jsonFilePath: string): Promise<void> {
  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(`JSON file not found: ${jsonFilePath}`);
  }

  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  console.log('path===============>', jsonFilePath);

  const data: ExternalProvider[] | ExternalProvider = JSON.parse(fileContent);
  const providers: ExternalProvider[] = Array.isArray(data) ? data : [data];

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  let createdCount = 0;
  let updatedCount = 0;

  for (const external of providers) {
    const payload = mapExternalProviderToProvider(external);

    const selector = external._id
      ? { _id: external._id }
      : { 'contactInfo.email': payload.contactInfo.email };

    const existing = await models.Provider.findOne(selector);

    if (existing) {
      await models.Provider.updateOne(
        { _id: existing._id },
        {
          $set: {
            ...payload,
            modifiedAt: payload.modifiedAt || new Date(),
          },
        },
      );
      updatedCount += 1;
    } else {
      await models.Provider.create({
        _id: external._id,
        ...payload,
      });
      createdCount += 1;
    }
  }

  await closeMongooose();

  process.stdout.write(
    `Providers import completed. Created: ${createdCount}, Updated: ${updatedCount}\n`,
  );
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    process.stderr.write('Usage: npm run import:providers <json-file-path>\n');
    process.stderr.write(
      '   or: tsx scripts/import-providers.ts <json-file-path>\n',
    );
    process.exit(1);
  }

  const jsonFilePath = path.resolve(args[0]);

  try {
    await importProviders(jsonFilePath);
  } catch (error: any) {
    process.stderr.write(`Import failed: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
