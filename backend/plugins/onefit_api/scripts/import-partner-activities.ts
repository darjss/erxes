import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import {
  IActivityType,
  GenderRestriction,
  IMultilingualString,
  IMultilingualStringOptional,
} from '../src/modules/activity-type/@types/activityType';

interface ExternalNumberLong {
  $numberLong: string;
}

interface PartnerActivity {
  _id: string;
  _p_partner: string; // "Partner$LADPcoBhR4"
  _p_activitySubType: string; // "ActivityType$h3iLphZvNa"
  price: number | ExternalNumberLong;
  status: number | ExternalNumberLong; // 1 = active, 0 = inactive
  isFeatured?: boolean;
  activityLimitPerSubscription?: number | ExternalNumberLong;
  audience?: 'adult' | 'kids' | 'all';
  fitPointPrice?: number;
}

interface ExternalDate {
  $date: string;
}

interface CategoryData {
  _id: string;
  name?: string;
  nameEn?: string;
  descriptionEn?: string;
  description?: string;
  _p_partnerActivity: string; // "PartnerActivity$aSzTDTVXTE"
  _p_activitySubType?: string; // "ActivityType$fE5rwbUTnj"
  _p_partner?: string; // "Partner$dZdNL7xueV"
  price?: number | ExternalNumberLong;
  cancellationDeadline?: number;
  date?: ExternalDate;
  startTime?: number;
  endTime?: number;
  status?: number | ExternalNumberLong;
  gender?: string;
  level?: string;
  levelEn?: string;
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

function getMultilingual(mn?: string, en?: string): IMultilingualString {
  const mnValue =
    mn && mn.trim().length > 0 ? mn.trim() : en?.trim() || 'Unknown';
  const enValue = en && en.trim().length > 0 ? en.trim() : mnValue;

  return {
    mn: mnValue || enValue,
    en: enValue || mnValue,
  };
}

function mapStatusToIsActive(status?: number | ExternalNumberLong): boolean {
  const statusValue = toNumber(status);
  return statusValue === 1;
}

function getRootCategoryId(audience?: 'adult' | 'kids' | 'all'): string {
  if (audience === 'kids') {
    return 'root_kids';
  }
  return 'root_adult';
}

function loadCategoryData(categoryJsonPath: string): Map<string, CategoryData> {
  if (!fs.existsSync(categoryJsonPath)) {
    console.warn(`Category JSON file not found: ${categoryJsonPath}`);
    return new Map();
  }

  const fileContent = fs.readFileSync(categoryJsonPath, 'utf-8');
  const categories: CategoryData[] = JSON.parse(fileContent);

  if (!Array.isArray(categories)) {
    console.warn('Category JSON file must contain an array');
    return new Map();
  }

  const categoryMap = new Map<string, CategoryData>();
  for (const category of categories) {
    if (category._p_partnerActivity) {
      const partnerActivityId = extractParsePointerId(
        category._p_partnerActivity,
      );
      if (partnerActivityId) {
        categoryMap.set(partnerActivityId, category);
      }
    }
  }

  return categoryMap;
}

async function importPartnerActivities(
  partnerActivityJsonPath: string,
  categoryJsonPath?: string,
): Promise<void> {
  console.log('Starting Partner Activity import...');

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

  const categoryMap = categoryJsonPath
    ? loadCategoryData(categoryJsonPath)
    : new Map<string, CategoryData>();

  console.log(`Loaded ${categoryMap.size} categories for name lookup`);

  await connect();
  console.log('Connected to MongoDB');

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  const ROOT_ADULT_ID = 'root_adult';
  const ROOT_KIDS_ID = 'root_kids';

  let createdCount = 0;
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
        console.warn(
          `Skipping partner activity ${partnerActivity._id}: Invalid provider pointer: ${partnerActivity._p_partner}`,
        );
        skippedCount++;
        continue;
      }

      if (!categoryId) {
        console.warn(
          `Skipping partner activity ${partnerActivity._id}: Invalid category pointer: ${partnerActivity._p_activitySubType}`,
        );
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
        console.warn(
          `Skipping partner activity ${partnerActivity._id}: Provider not found: ${providerId}`,
        );
        skippedCount++;
        continue;
      }

      const existingCategory = await models.ActivityCategory.findOne({
        _id: categoryId,
      });
      if (!existingCategory) {
        console.warn(
          `Skipping partner activity ${partnerActivity._id}: Category not found in database: ${categoryId}`,
        );
        skippedCount++;
        continue;
      }

      const category = categoryMap.get(partnerActivity._id);

      let name: IMultilingualString;
      if (category && (category.name || category.nameEn)) {
        name = getMultilingual(category.name, category.nameEn);
      } else {
        name = existingCategory.name;
      }

      let description: IMultilingualStringOptional | undefined;
      if (category && (category.description || category.descriptionEn)) {
        description = {
          en: category.descriptionEn,
          mn: category.description,
        };
      } else if (existingCategory.description) {
        description = existingCategory.description;
      }

      const creditCost = toNumber(partnerActivity.fitPointPrice);
      const isActive = mapStatusToIsActive(partnerActivity.status);
      const duration = 60;
      const genderRestriction =
        category?.gender === 'male'
          ? GenderRestriction.MALE
          : category?.gender === 'female'
          ? GenderRestriction.FEMALE
          : GenderRestriction.MIXED;

      const audience = partnerActivity.audience || 'all';
      const rootCategoryId = getRootCategoryId(audience);
      const categoryIds = [categoryId, rootCategoryId];

      const cancellationDeadline = category?.cancellationDeadline;

      const activityTypeData: IActivityType = {
        providerId,
        name,
        description,
        creditCost,
        duration,
        genderRestriction,
        categoryIds,
        isActive,
        cancellationDeadline,
      };

      const existing = await models.ActivityType.findOne({
        providerId,
        categoryIds: { $all: [categoryId] },
      });

      if (existing) {
        await models.ActivityType.updateActivityType(
          existing._id,
          activityTypeData,
        );
        updatedCount++;
        console.log(
          `Updated: ${name.en} for provider ${providerId} (category: ${categoryId})`,
        );
      } else {
        await models.ActivityType.createActivityType(activityTypeData);
        createdCount++;
        console.log(
          `Created: ${name.en} for provider ${providerId} (category: ${categoryId})`,
        );
      }
    } catch (error: any) {
      errorCount++;
      console.error(
        `Error processing partner activity ${partnerActivity._id}:`,
        error.message,
      );
    }
  }

  await closeMongooose();

  console.log('\n=== Import Summary ===');
  console.log(
    `Total partner activities processed: ${partnerActivities.length}`,
  );
  console.log(`ActivityTypes created: ${createdCount}`);
  console.log(`ActivityTypes updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('\nImport completed!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    process.stderr.write(
      'Usage: npm run import:partner-activities <partner-activity-json-path> [category-json-path]\n',
    );
    process.stderr.write(
      '   or: tsx scripts/import-partner-activities.ts <partner-activity-json-path> [category-json-path]\n',
    );
    process.exit(1);
  }

  const partnerActivityJsonPath = path.resolve(args[0]);
  const categoryJsonPath = args[1] ? path.resolve(args[1]) : undefined;

  try {
    await importPartnerActivities(partnerActivityJsonPath, categoryJsonPath);
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
