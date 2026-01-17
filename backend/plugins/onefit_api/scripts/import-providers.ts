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
  photo?: string;
}

interface ExternalPartnerCover {
  _id: string;
  _p_partner?: string;
  image?: string;
  image_old?: string;
  _created_at?: ExternalDate;
  _updated_at?: ExternalDate;
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

  const icon =
    external.photo && external.photo.trim().length > 0
      ? external.photo.trim()
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
    icon,
    // createdAt,
    // modifiedAt,
  };

  return provider;
}

function loadPartnerCovers(
  coverJsonPath: string,
): Map<string, string[]> {
  const coversMap = new Map<string, string[]>();

  if (!fs.existsSync(coverJsonPath)) {
    process.stdout.write(
      `Warning: PartnerCover JSON file not found: ${coverJsonPath}. Skipping cover images.\n`,
    );
    return coversMap;
  }

  try {
    const coverFileContent = fs.readFileSync(coverJsonPath, 'utf-8');
    const coverData:
      | ExternalPartnerCover[]
      | ExternalPartnerCover = JSON.parse(coverFileContent);
    const covers: ExternalPartnerCover[] = Array.isArray(coverData)
      ? coverData
      : [coverData];

    for (const cover of covers) {
      if (!cover._p_partner || !cover.image) {
        continue;
      }

      // Extract partner ID from "Partner$ID" format
      const partnerIdMatch = cover._p_partner.match(/^Partner\$(.+)$/);
      if (!partnerIdMatch) {
        continue;
      }

      const partnerId = partnerIdMatch[1];
      const image = cover.image.trim();

      if (image.length === 0) {
        continue;
      }

      if (!coversMap.has(partnerId)) {
        coversMap.set(partnerId, []);
      }

      coversMap.get(partnerId)!.push(image);
    }
  } catch (error: any) {
    process.stderr.write(
      `Warning: Failed to load PartnerCover JSON: ${error.message}. Skipping cover images.\n`,
    );
  }

  return coversMap;
}

async function importProviders(
  jsonFilePath: string,
  coverJsonPath?: string,
): Promise<void> {
  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(`JSON file not found: ${jsonFilePath}`);
  }

  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  console.log('path===============>', jsonFilePath);

  const data: ExternalProvider[] | ExternalProvider = JSON.parse(fileContent);
  const providers: ExternalProvider[] = Array.isArray(data) ? data : [data];

  // Load partner covers if path is provided
  const coversMap = coverJsonPath
    ? loadPartnerCovers(coverJsonPath)
    : new Map<string, string[]>();

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  let createdCount = 0;
  let updatedCount = 0;
  let coversAddedCount = 0;

  for (const external of providers) {
    const payload = mapExternalProviderToProvider(external);

    // Get cover images for this provider
    const coverImages = coversMap.get(external._id) || [];
    if (coverImages.length > 0) {
      payload.coverImages = coverImages;
      coversAddedCount += coverImages.length;
    }

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
    `Providers import completed. Created: ${createdCount}, Updated: ${updatedCount}, Cover images added: ${coversAddedCount}\n`,
  );
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    process.stderr.write(
      'Usage: npm run import:providers <json-file-path> [cover-json-file-path]\n',
    );
    process.stderr.write(
      '   or: tsx scripts/import-providers.ts <json-file-path> [cover-json-file-path]\n',
    );
    process.exit(1);
  }

  const jsonFilePath = path.resolve(args[0]);
  const coverJsonPath =
    args.length > 1 ? path.resolve(args[1]) : undefined;

  // If cover path not provided, try to find it in the same directory as provider.json
  const defaultCoverPath = coverJsonPath
    ? undefined
    : path.resolve(
        path.dirname(jsonFilePath),
        'onefit.PartnerCover.json',
      );

  try {
    await importProviders(jsonFilePath, coverJsonPath || defaultCoverPath);
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
