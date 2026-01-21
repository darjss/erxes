import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import {
  connect,
  closeMongooose,
  getEnv,
  getSaasCoreConnection,
  coreModelOrganizations,
} from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';
import { IActivityCategory } from '../src/modules/category/@types/category';

interface ParseFile {
  __type: 'File';
  name: string;
  url: string;
}

interface ParsePointer {
  __type: 'Pointer';
  className: string;
  objectId: string;
}

export interface ActivityType {
  objectId: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  position: number;

  image: ParseFile;

  name: string;
  nameEn: string;

  image_old?: string | null;

  enabled: boolean;
  icon: string;
  audience: 'adult' | 'kids' | 'all';

  iconImage: ParseFile;

  parent?: ParsePointer;
}

async function mapActivityTypeToCategory(
  activityType: ActivityType,
): Promise<Omit<IActivityCategory, 'parentId'>> {
  return {
    name: {
      en: activityType.nameEn || activityType.name,
      mn: activityType.name || activityType.nameEn,
    },
    description: undefined,
    isActive: activityType.enabled ?? true,
    image: activityType.image?.url || activityType.image_old || undefined,
    icon: activityType.iconImage?.url || activityType.icon || undefined,
    createdAt: activityType.createdAt
      ? new Date(activityType.createdAt)
      : new Date(),
    modifiedAt: activityType.updatedAt
      ? new Date(activityType.updatedAt)
      : new Date(),
  };
}

async function importActivityTypes(
  jsonFilePath: string,
  subdomain?: string,
): Promise<void> {
  console.log('Starting ActivityType import...');

  // Read JSON file
  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(`JSON file not found: ${jsonFilePath}`);
  }

  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const activityTypes: ActivityType[] = JSON.parse(fileContent);

  if (!Array.isArray(activityTypes)) {
    throw new Error('JSON file must contain an array of ActivityType objects');
  }

  console.log(`Found ${activityTypes.length} activity types to import`);

  // Connect to MongoDB
  await connect();
  console.log('Connected to MongoDB');

  // Initialize models
  let db: mongoose.Connection;
  db = mongoose.connection;

  const models: IModels = loadClasses(db);

  // Create root categories for Adult and Kids
  console.log('\n=== Creating Root Categories ===');
  const ROOT_ADULT_ID = 'root_adult';
  const ROOT_KIDS_ID = 'root_kids';
  const UNCATEGORIZED_ID = 'jfRqF784sJ';
  const rootAdult = await models.ActivityCategory.findOne({
    _id: ROOT_ADULT_ID,
  });
  if (!rootAdult) {
    await models.ActivityCategory.create({
      _id: ROOT_ADULT_ID,
      name: {
        en: 'Adult',
        mn: 'Том хүн',
      },
      isActive: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    console.log('Created root category: Adult');
  } else {
    console.log('Root category already exists: Adult');
  }

  const rootKids = await models.ActivityCategory.findOne({ _id: ROOT_KIDS_ID });
  if (!rootKids) {
    await models.ActivityCategory.create({
      _id: ROOT_KIDS_ID,
      name: {
        en: 'Kids',
        mn: 'Хүүхэд',
      },
      isActive: true,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    console.log('Created root category: Kids');
  } else {
    console.log('Root category already exists: Kids');
  }
  const uncategorized = await models.ActivityCategory.findOne({
    _id: UNCATEGORIZED_ID,
  });
  if (!uncategorized) {
    await models.ActivityCategory.create({
      _id: UNCATEGORIZED_ID,
      name: {
        en: 'uncategorized',
        mn: 'uncategorized',
      },
      isActive: true,
      parentId: ROOT_ADULT_ID,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    console.log('Created root category: uncategorized');
  } else {
    console.log('Root category already exists: uncategorized');
  }
  // First pass: Create all categories without parentId
  console.log('\n=== First Pass: Creating categories ===');
  const objectIdMapping: Map<string, string> = new Map();
  let createdCount = 0;
  let skippedCount = 0;

  for (const activityType of activityTypes) {
    try {
      // Check if category already exists by objectId
      const existingCategory = await models.ActivityCategory.findOne({
        _id: activityType.objectId,
      });

      if (existingCategory) {
        console.log(
          `Skipping ${
            activityType.nameEn || activityType.name
          } (already exists)`,
        );
        objectIdMapping.set(activityType.objectId, existingCategory._id);
        skippedCount++;
        continue;
      }

      const categoryData = await mapActivityTypeToCategory(activityType);

      // Create category with original objectId as _id
      const category = await models.ActivityCategory.create({
        _id: activityType.objectId,
        ...categoryData,
      });

      objectIdMapping.set(activityType.objectId, category._id);
      createdCount++;
      console.log(
        `Created: ${activityType.nameEn || activityType.name} (${
          category._id
        })`,
      );
    } catch (error: any) {
      console.error(
        `Error creating category for ${
          activityType.nameEn || activityType.name
        }:`,
        error.message,
      );
      // Continue with next item
    }
  }

  console.log(
    `\nFirst pass complete: ${createdCount} created, ${skippedCount} skipped`,
  );

  // Second pass: Update parentIds
  console.log('\n=== Second Pass: Updating parent relationships ===');
  let updatedCount = 0;
  let rootAssignedCount = 0;

  for (const activityType of activityTypes) {
    try {
      const categoryId = objectIdMapping.get(activityType.objectId);

      if (!categoryId) {
        console.warn(
          `Category not found for objectId: ${activityType.objectId}`,
        );
        continue;
      }

      let parentId: string | undefined;

      // If category has a parent in the data, try to use it
      if (activityType.parent) {
        const parentObjectId = activityType.parent.objectId;
        const mappedParentId = objectIdMapping.get(parentObjectId);

        if (mappedParentId) {
          parentId = mappedParentId;
        } else {
          // Parent not found in mapping, check if it exists in DB
          const existingParent = await models.ActivityCategory.findOne({
            _id: parentObjectId,
          });
          if (existingParent) {
            parentId = existingParent._id;
            objectIdMapping.set(parentObjectId, existingParent._id);
          }
        }
      }

      // If no parent found, assign to root category based on audience
      if (!parentId) {
        if (activityType.audience === 'kids') {
          parentId = ROOT_KIDS_ID;
        } else {
          // For 'adult' or 'all', assign to Adult root
          parentId = ROOT_ADULT_ID;
        }
        rootAssignedCount++;
      }

      await models.ActivityCategory.updateCategory(categoryId, {
        parentId,
      } as IActivityCategory);

      updatedCount++;
      if (parentId === ROOT_ADULT_ID || parentId === ROOT_KIDS_ID) {
        console.log(
          `Assigned to root (${
            parentId === ROOT_ADULT_ID ? 'Adult' : 'Kids'
          }): ${activityType.nameEn || activityType.name}`,
        );
      } else {
        console.log(
          `Updated parent for: ${activityType.nameEn || activityType.name}`,
        );
      }
    } catch (error: any) {
      console.error(
        `Error updating parent for ${
          activityType.nameEn || activityType.name
        }:`,
        error.message,
      );
    }
  }

  console.log(
    `\nSecond pass complete: ${updatedCount} parent relationships updated`,
  );
  console.log(`Categories assigned to root: ${rootAssignedCount}`);

  // Summary
  console.log('\n=== Import Summary ===');
  console.log(`Total activity types: ${activityTypes.length}`);
  console.log(`Categories created: ${createdCount}`);
  console.log(`Categories skipped: ${skippedCount}`);
  console.log(`Parent relationships updated: ${updatedCount}`);
  console.log(`Categories assigned to root: ${rootAssignedCount}`);

  // Close connection
  await closeMongooose();
  console.log('\nImport completed successfully!');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'Usage: npm run import:category <json-file-path> [subdomain]',
    );
    console.error(
      '   or: tsx scripts/import-category.ts <json-file-path> [subdomain]',
    );
    process.exit(1);
  }

  const jsonFilePath = path.resolve(args[0]);
  const subdomain = args[1];

  try {
    await importActivityTypes(jsonFilePath, subdomain);
  } catch (error: any) {
    console.error('Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
