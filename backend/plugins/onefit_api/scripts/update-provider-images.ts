import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import { connect, closeMongooose } from 'erxes-api-shared/utils';
import { loadClasses, IModels } from '../src/connectionResolvers';

interface UploadResult {
  originalFilename: string;
  cloudflareKey: string;
  success: boolean;
  error?: string;
}

interface UploadResults {
  totalImages: number;
  uploaded: number;
  failed: number;
  bucketName: string;
  results: UploadResult[];
}

function loadUploadResults(jsonFilePath: string): Map<string, string> {
  if (!fs.existsSync(jsonFilePath)) {
    throw new Error(`Upload results JSON file not found: ${jsonFilePath}`);
  }

  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const data: UploadResults = JSON.parse(fileContent);

  const mapping = new Map<string, string>();

  for (const result of data.results) {
    if (result.success && result.originalFilename && result.cloudflareKey) {
      mapping.set(result.originalFilename, result.cloudflareKey);
    }
  }

  return mapping;
}

function findMatchingFilename(
  value: string | undefined,
  filenameMapping: Map<string, string>,
): { filename: string; cloudflareKey: string; exactMatch: boolean } | null {
  if (!value || typeof value !== 'string') {
    return null;
  }

  // Check for exact matches first
  if (filenameMapping.has(value)) {
    return {
      filename: value,
      cloudflareKey: filenameMapping.get(value)!,
      exactMatch: true,
    };
  }

  // Check if any filename is contained in the value (for partial matches)
  for (const [filename, cloudflareKey] of filenameMapping.entries()) {
    if (value.includes(filename)) {
      return { filename, cloudflareKey, exactMatch: false };
    }
  }

  return null;
}

async function updateProviderImages(
  resultsFilePath: string,
): Promise<void> {
  process.stdout.write('Loading upload results...\n');
  const filenameMapping = loadUploadResults(resultsFilePath);
  process.stdout.write(
    `Loaded ${filenameMapping.size} successful upload mappings.\n\n`,
  );

  await connect();

  const db: mongoose.Connection = mongoose.connection;
  const models: IModels = loadClasses(db);

  process.stdout.write('Querying all providers...\n');
  const providers = await models.Provider.find({});
  process.stdout.write(`Found ${providers.length} providers.\n\n`);

  let providersUpdated = 0;
  let iconsReplaced = 0;
  let coversReplaced = 0;

  process.stdout.write('Processing providers...\n');

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];

    if ((i + 1) % 100 === 0 || i === providers.length - 1) {
      process.stdout.write(
        `Progress: ${i + 1}/${providers.length} (${Math.round(((i + 1) / providers.length) * 100)}%)\n`,
      );
    }

    let iconUpdated = false;
    let coversUpdated = false;
    let newIcon = provider.icon;
    let newCoverImages = provider.coverImages ? [...provider.coverImages] : [];

    // Check icon field
    if (provider.icon) {
      const iconMatch = findMatchingFilename(provider.icon, filenameMapping);
      if (iconMatch) {
        // For exact matches, replace entire value. For partial matches, replace filename part
        newIcon = iconMatch.exactMatch
          ? iconMatch.cloudflareKey
          : provider.icon.replace(iconMatch.filename, iconMatch.cloudflareKey);
        iconUpdated = newIcon !== provider.icon;
        if (iconUpdated) {
          iconsReplaced += 1;
        }
      }
    }

    // Check coverImages array
    if (provider.coverImages && provider.coverImages.length > 0) {
      for (let j = 0; j < newCoverImages.length; j++) {
        const coverImage = newCoverImages[j];
        const coverMatch = findMatchingFilename(coverImage, filenameMapping);
        if (coverMatch) {
          // For exact matches, replace entire value. For partial matches, replace filename part
          newCoverImages[j] = coverMatch.exactMatch
            ? coverMatch.cloudflareKey
            : coverImage.replace(coverMatch.filename, coverMatch.cloudflareKey);
          coversUpdated = true;
        }
      }
      if (coversUpdated) {
        const replacedCount = newCoverImages.filter(
          (img, idx) => img !== provider.coverImages![idx],
        ).length;
        coversReplaced += replacedCount;
      }
    }

    // Update provider if any changes were made
    if (iconUpdated || coversUpdated) {
      const updateData: any = {};
      if (iconUpdated) {
        updateData.icon = newIcon;
      }
      if (coversUpdated) {
        updateData.coverImages = newCoverImages;
      }

      await models.Provider.updateProvider(provider._id, updateData);
      providersUpdated += 1;
    }
  }

  await closeMongooose();

  process.stdout.write('\n=== Update Summary ===\n');
  process.stdout.write(`Total providers processed: ${providers.length}\n`);
  process.stdout.write(`Providers updated: ${providersUpdated}\n`);
  process.stdout.write(`Icons replaced: ${iconsReplaced}\n`);
  process.stdout.write(`Cover images replaced: ${coversReplaced}\n`);
}

async function main() {
  const args = process.argv.slice(2);

  let resultsFilePath: string | undefined;

  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];

    if (key === 'results-file' && value) {
      resultsFilePath = path.resolve(value);
    }
  }

  // Default to upload-results.json in scripts directory
  if (!resultsFilePath) {
    resultsFilePath = path.resolve(
      __dirname,
      'upload-results.json',
    );
  }

  try {
    await updateProviderImages(resultsFilePath);
    process.stdout.write('\nUpdate process completed successfully.\n');
  } catch (error: any) {
    process.stderr.write(`Error: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
