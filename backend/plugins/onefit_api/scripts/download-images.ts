import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

interface ExternalProvider {
  _id: string;
  photo?: string;
  [key: string]: any;
}

interface ExternalPartnerCover {
  _id: string;
  _p_partner?: string;
  image?: string;
  [key: string]: any;
}

interface DownloadResult {
  originalFilename: string;
  localPath: string;
  success: boolean;
  error?: string;
}

function extractImageFilenames(
  providerJsonPath: string,
  coverJsonPath: string,
): Set<string> {
  const imageFilenames = new Set<string>();

  // Extract from provider.json
  if (fs.existsSync(providerJsonPath)) {
    const providerContent = fs.readFileSync(providerJsonPath, 'utf-8');
    const providers: ExternalProvider[] | ExternalProvider = JSON.parse(
      providerContent,
    );
    const providerArray = Array.isArray(providers) ? providers : [providers];

    for (const provider of providerArray) {
      if (provider.photo && provider.photo.trim().length > 0) {
        imageFilenames.add(provider.photo.trim());
      }
    }
  }

  // Extract from cover JSON
  if (fs.existsSync(coverJsonPath)) {
    const coverContent = fs.readFileSync(coverJsonPath, 'utf-8');
    const covers: ExternalPartnerCover[] | ExternalPartnerCover = JSON.parse(
      coverContent,
    );
    const coverArray = Array.isArray(covers) ? covers : [covers];

    for (const cover of coverArray) {
      if (cover.image && cover.image.trim().length > 0) {
        imageFilenames.add(cover.image.trim());
      }
    }
  }

  return imageFilenames;
}

async function downloadImage(
  url: string,
  filepath: string,
): Promise<boolean> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    await fs.promises.mkdir(dir, { recursive: true });
    
    await fs.promises.writeFile(filepath, buffer);

    return true;
  } catch (error: any) {
    return false;
  }
}

async function downloadImages(
  prefixUrl: string,
  outputDir: string,
  providerJsonPath: string,
  coverJsonPath: string,
): Promise<void> {
  process.stdout.write('Extracting image filenames from JSON files...\n');

  const imageFilenames = extractImageFilenames(providerJsonPath, coverJsonPath);
  const totalImages = imageFilenames.size;

  process.stdout.write(`Found ${totalImages} unique images to download.\n`);

  if (totalImages === 0) {
    process.stdout.write('No images found. Exiting.\n');
    return;
  }

  // Create output directory
  await fs.promises.mkdir(outputDir, { recursive: true });

  const results: DownloadResult[] = [];
  let processed = 0;
  let downloaded = 0;
  let failed = 0;

  process.stdout.write('Starting download process...\n');

  for (const imageFilename of imageFilenames) {
    processed += 1;

    if (processed % 10 === 0 || processed === totalImages) {
      process.stdout.write(
        `Progress: ${processed}/${totalImages} (${Math.round((processed / totalImages) * 100)}%)\n`,
      );
    }

    const imageUrl = `${prefixUrl}${imageFilename}`;
    const localFilePath = path.join(outputDir, imageFilename);

    try {
      const downloadSuccess = await downloadImage(imageUrl, localFilePath);

      if (downloadSuccess) {
        downloaded += 1;
        results.push({
          originalFilename: imageFilename,
          localPath: localFilePath,
          success: true,
        });
      } else {
        failed += 1;
        results.push({
          originalFilename: imageFilename,
          localPath: '',
          success: false,
          error: 'Download failed',
        });
      }
    } catch (error: any) {
      failed += 1;
      results.push({
        originalFilename: imageFilename,
        localPath: '',
        success: false,
        error: error.message || 'Unknown error',
      });
    }
  }

  // Print summary
  process.stdout.write('\n=== Download Summary ===\n');
  process.stdout.write(`Total images: ${totalImages}\n`);
  process.stdout.write(`Successfully downloaded: ${downloaded}\n`);
  process.stdout.write(`Failed downloads: ${failed}\n`);

  // Save results to manifest file
  const manifestPath = path.join(outputDir, 'download-manifest.json');
  await fs.promises.writeFile(
    manifestPath,
    JSON.stringify(
      {
        totalImages,
        downloaded,
        failed,
        outputDir,
        results,
      },
      null,
      2,
    ),
    'utf-8',
  );
  process.stdout.write(`\nManifest saved to: ${manifestPath}\n`);

  // Print failed images if any
  const failedImages = results.filter((r) => !r.success);
  if (failedImages.length > 0) {
    process.stdout.write('\n=== Failed Downloads ===\n');
    for (const failed of failedImages.slice(0, 20)) {
      process.stdout.write(
        `- ${failed.originalFilename}: ${failed.error}\n`,
      );
    }
    if (failedImages.length > 20) {
      process.stdout.write(
        `... and ${failedImages.length - 20} more failures\n`,
      );
    }
  }
}

function parseArgs(): {
  prefixUrl: string;
  outputDir: string;
  providerJsonPath: string;
  coverJsonPath: string;
} {
  const args = process.argv.slice(2);
  const parsed: any = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];

    if (key && value) {
      parsed[key] = value;
    }
  }

  // Required arguments
  const prefixUrl = parsed['prefix-url'] || process.env.PREFIX_URL;
  const outputDir = parsed['output-dir'] || process.env.OUTPUT_DIR;

  // Optional JSON paths
  const providerJsonPath =
    parsed['provider-json'] ||
    path.resolve(__dirname, 'provider.json');
  const coverJsonPath =
    parsed['cover-json'] ||
    path.resolve(__dirname, 'onefit.PartnerCover.json');

  if (!prefixUrl) {
    throw new Error('--prefix-url is required (or set PREFIX_URL env var)');
  }

  if (!outputDir) {
    throw new Error('--output-dir is required (or set OUTPUT_DIR env var)');
  }

  return {
    prefixUrl: prefixUrl.endsWith('/') ? prefixUrl : `${prefixUrl}/`,
    outputDir: path.resolve(outputDir),
    providerJsonPath: path.resolve(providerJsonPath),
    coverJsonPath: path.resolve(coverJsonPath),
  };
}

async function main() {
  try {
    const { prefixUrl, outputDir, providerJsonPath, coverJsonPath } =
      parseArgs();

    process.stdout.write('=== OneFit Image Download ===\n');
    process.stdout.write(`Prefix URL: ${prefixUrl}\n`);
    process.stdout.write(`Output Directory: ${outputDir}\n`);
    process.stdout.write(`Provider JSON: ${providerJsonPath}\n`);
    process.stdout.write(`Cover JSON: ${coverJsonPath}\n\n`);

    await downloadImages(prefixUrl, outputDir, providerJsonPath, coverJsonPath);

    process.stdout.write('\nDownload process completed.\n');
  } catch (error: any) {
    process.stderr.write(`Error: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.stderr.write(
      '\nUsage:\n' +
        '  tsx scripts/download-images.ts \\\n' +
        '    --prefix-url "https://cdn.example.com/images/" \\\n' +
        '    --output-dir "./downloaded-images" \\\n' +
        '    [--provider-json "scripts/provider.json"] \\\n' +
        '    [--cover-json "scripts/onefit.PartnerCover.json"]\n\n' +
        'Or set environment variables:\n' +
        '  PREFIX_URL, OUTPUT_DIR\n',
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
