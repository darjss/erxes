import * as fs from 'fs';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { fileTypeFromBuffer } from 'file-type/core';
import { sanitizeFilename, randomAlphanumeric } from 'erxes-api-shared/utils';

interface CloudflareConfig {
  accountId: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  apiToken?: string;
  bucketName: string;
  useApiToken?: boolean;
}

interface UploadResult {
  originalFilename: string;
  cloudflareKey: string;
  success: boolean;
  error?: string;
}

interface DownloadManifest {
  totalImages: number;
  downloaded: number;
  failed: number;
  outputDir: string;
  results: Array<{
    originalFilename: string;
    localPath: string;
    success: boolean;
    error?: string;
  }>;
}

function createCFR2(config: CloudflareConfig): AWS.S3 {
  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;

  if (!config.accessKeyId || !config.secretAccessKey) {
    throw new Error('Cloudflare R2 Credentials are not configured (accessKeyId and secretAccessKey required)');
  }

  const options: {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    signatureVersion: 'v4';
    region: string;
  } = {
    endpoint,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    signatureVersion: 'v4',
    region: 'auto',
  };

  return new AWS.S3(options);
}

async function verifyBucketExists(config: CloudflareConfig): Promise<void> {
  // If using API token, skip R2 bucket verification (Cloudflare Images doesn't use buckets the same way)
  if (config.useApiToken) {
    // Verify API token by making a test request to Cloudflare Images API
    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`;
    const headers = {
      Authorization: `Bearer ${config.apiToken}`,
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            `Invalid or unauthorized API token.\n` +
              `Please verify:\n` +
              `  1. Your CLOUDFLARE_API_TOKEN is correct\n` +
              `  2. The token has permission to access Cloudflare Images\n` +
              `  3. The token is associated with account ${config.accountId}`,
          );
        }
        throw new Error(`Failed to verify API token: HTTP ${response.status}`);
      }
      return;
    } catch (error: any) {
      if (error.message.includes('Invalid') || error.message.includes('unauthorized')) {
        throw error;
      }
      throw new Error(`Failed to verify Cloudflare Images API access: ${error.message}`);
    }
  }

  // For R2, verify bucket exists
  const r2 = createCFR2(config);

  return new Promise((resolve, reject) => {
    r2.headBucket(
      {
        Bucket: config.bucketName,
      },
      (err) => {
        if (err) {
          const errorCode = err.code || err.statusCode;
          const errorMessage = err.message || 'Unknown error';

          if (errorCode === 'NotFound' || errorCode === 'NoSuchBucket' || errorCode === 404) {
            reject(
              new Error(
                `Bucket "${config.bucketName}" does not exist.\n` +
                  `Please verify:\n` +
                  `  1. The bucket name is correct (case-sensitive)\n` +
                  `  2. The bucket exists in your Cloudflare R2 account\n` +
                  `  3. Use --list-buckets to see available buckets`,
              ),
            );
          } else if (errorCode === 'Forbidden' || errorCode === 403) {
            reject(
              new Error(
                `Access denied to bucket "${config.bucketName}".\n` +
                  `Please verify:\n` +
                  `  1. Your access key has permission to access this bucket\n` +
                  `  2. The bucket exists in the account associated with your credentials`,
              ),
            );
          } else {
            reject(
              new Error(
                `Failed to verify bucket "${config.bucketName}": ${errorMessage} (${errorCode})`,
              ),
            );
          }
        } else {
          resolve();
        }
      },
    );
  });
}

async function listBuckets(config: CloudflareConfig): Promise<void> {
  // If using API token, we can't list R2 buckets
  if (config.useApiToken) {
    process.stdout.write(
      'Note: --list-buckets is only available for R2 (using access key ID/secret).\n' +
        'Cloudflare Images API (using API token) does not use the same bucket concept.\n' +
        'The bucket name in Cloudflare Images is used as a namespace/prefix for image IDs.\n',
    );
    return;
  }

  const r2 = createCFR2(config);

  return new Promise((resolve, reject) => {
    r2.listBuckets((err, data) => {
      if (err) {
        const errorCode = err.code || err.statusCode;
        const errorMessage = err.message || 'Unknown error';
        reject(
          new Error(
            `Failed to list buckets: ${errorMessage} (${errorCode})\n` +
              `Please verify your Cloudflare R2 credentials are correct.`,
          ),
        );
        return;
      }

      if (!data || !data.Buckets || data.Buckets.length === 0) {
        process.stdout.write('No buckets found in your Cloudflare R2 account.\n');
        resolve();
        return;
      }

      process.stdout.write('\n=== Available R2 Buckets ===\n');
      data.Buckets.forEach((bucket) => {
        const marker = bucket.Name === config.bucketName ? ' <-- specified bucket' : '';
        process.stdout.write(`  - ${bucket.Name}${marker}\n`);
      });
      process.stdout.write(`\nTotal: ${data.Buckets.length} bucket(s)\n\n`);

      if (config.bucketName && !data.Buckets.some((b) => b.Name === config.bucketName)) {
        process.stdout.write(
          `⚠️  Warning: The specified bucket "${config.bucketName}" was not found in the list above.\n`,
        );
      }

      resolve();
    });
  });
}

async function uploadToCloudflare(
  filepath: string,
  originalFilename: string,
  config: CloudflareConfig,
): Promise<string> {
  const sanitizedFilename = sanitizeFilename(originalFilename);
  let fileName = `${randomAlphanumeric()}${sanitizedFilename}`;

  const buffer = fs.readFileSync(filepath);
  // @ts-ignore - Buffer is compatible with fileTypeFromBuffer
  const detectedType = await fileTypeFromBuffer(buffer);

  const mimetype = detectedType?.mime || 'application/octet-stream';

  // Use Cloudflare Images API if API token is provided
  if (config.useApiToken && config.apiToken) {
    const extension = fileName.split('.').pop();
    if (extension && ['JPEG', 'JPG', 'PNG'].includes(extension.toUpperCase())) {
      const baseName = fileName.slice(0, -(extension.length + 1));
      fileName = `${baseName}.${extension.toLowerCase()}`;
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`;
    const headers = {
      Authorization: `Bearer ${config.apiToken}`,
    };

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filepath));
    formData.append('id', `${config.bucketName}/${fileName}`);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.errors?.[0]?.message || data.message || 'Unknown error';
      throw new Error(`Cloudflare Images API error: ${errorMessage}`);
    }

    if (data.result.variants && data.result.variants.length > 0) {
      // Return the image ID (bucket/name format) for consistency
      return `${config.bucketName}/${fileName}`;
    }

    return `${config.bucketName}/${fileName}`;
  }

  // Use R2 (S3-compatible) if access keys are provided
  const r2 = createCFR2(config);

  const response: any = await new Promise((resolve, reject) => {
    r2.upload(
      {
        ContentType: mimetype,
        Bucket: config.bucketName,
        Key: fileName,
        Body: buffer,
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      },
    );
  });

  return fileName;
}

async function uploadImages(
  imagesDir: string,
  config: CloudflareConfig,
): Promise<void> {
  if (!fs.existsSync(imagesDir)) {
    throw new Error(`Images directory does not exist: ${imagesDir}`);
  }

  // Try to load manifest if it exists
  const manifestPath = path.join(imagesDir, 'download-manifest.json');
  let imageFiles: string[] = [];

  if (fs.existsSync(manifestPath)) {
    process.stdout.write('Loading manifest file...\n');
    const manifest: DownloadManifest = JSON.parse(
      fs.readFileSync(manifestPath, 'utf-8'),
    );

    // Only upload successfully downloaded images
    imageFiles = manifest.results
      .filter((r) => r.success && r.localPath)
      .map((r) => r.localPath);
  } else {
    // If no manifest, upload all files in directory
    process.stdout.write('No manifest found. Uploading all files in directory...\n');
    const files = await fs.promises.readdir(imagesDir);
    imageFiles = files
      .filter((file) => {
        const filePath = path.join(imagesDir, file);
        const stat = fs.statSync(filePath);
        return stat.isFile() && file !== 'download-manifest.json';
      })
      .map((file) => path.join(imagesDir, file));
  }

  const totalImages = imageFiles.length;

  if (totalImages === 0) {
    process.stdout.write('No images found to upload. Exiting.\n');
    return;
  }

  process.stdout.write(`Found ${totalImages} images to upload.\n`);

  const results: UploadResult[] = [];
  let processed = 0;
  let uploaded = 0;
  let failed = 0;

  process.stdout.write('Starting upload process...\n');

  for (const imagePath of imageFiles) {
    processed += 1;

    if (processed % 10 === 0 || processed === totalImages) {
      process.stdout.write(
        `Progress: ${processed}/${totalImages} (${Math.round((processed / totalImages) * 100)}%)\n`,
      );
    }

    const originalFilename = path.basename(imagePath);

    try {
      const cloudflareKey = await uploadToCloudflare(
        imagePath,
        originalFilename,
        config,
      );

      uploaded += 1;
      results.push({
        originalFilename,
        cloudflareKey,
        success: true,
      });
    } catch (uploadError: any) {
      console.log('uploadError', uploadError);
      failed += 1;
      results.push({
        originalFilename,
        cloudflareKey: '',
        success: false,
        error: `Upload failed: ${uploadError.message}`,
      });
    }
  }

  // Print summary
  process.stdout.write('\n=== Upload Summary ===\n');
  process.stdout.write(`Total images: ${totalImages}\n`);
  process.stdout.write(`Successfully uploaded: ${uploaded}\n`);
  process.stdout.write(`Upload failures: ${failed}\n`);

  // Save results to file
  const resultsPath = path.join(imagesDir, 'upload-results.json');
  await fs.promises.writeFile(
    resultsPath,
    JSON.stringify(
      {
        totalImages,
        uploaded,
        failed,
        bucketName: config.bucketName,
        results,
      },
      null,
      2,
    ),
    'utf-8',
  );
  process.stdout.write(`\nResults saved to: ${resultsPath}\n`);

  // Print failed images if any
  const failedImages = results.filter((r) => !r.success);
  if (failedImages.length > 0) {
    process.stdout.write('\n=== Failed Uploads ===\n');
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
  imagesDir: string;
  config: CloudflareConfig;
  listBucketsOnly: boolean;
} {
  const args = process.argv.slice(2);
  const parsed: any = {};

  // Check for flags (no value)
  const listBucketsOnly = args.includes('--list-buckets');

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];

    if (key && value) {
      parsed[key] = value;
    }
  }

  // Required arguments
  const imagesDir = parsed['images-dir'] || process.env.IMAGES_DIR;
  const accountId =
    parsed['account-id'] ||
    process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId =
    parsed['access-key-id'] ||
    process.env.CLOUDFLARE_ACCESS_KEY_ID;
  const secretAccessKey =
    parsed['secret-access-key'] ||
    process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
  const apiToken =
    parsed['api-token'] ||
    process.env.CLOUDFLARE_API_TOKEN;
  const bucketName =
    parsed['bucket-name'] || process.env.CLOUDFLARE_BUCKET_NAME;

  // Determine which authentication method to use
  const useApiToken = !!apiToken;

  // For list-buckets, only credentials are required (not imagesDir or bucketName)
  if (listBucketsOnly) {
    if (useApiToken) {
      if (!accountId || !apiToken) {
        throw new Error(
          'Cloudflare credentials are required for listing (API token mode):\n' +
            '  --account-id (or CLOUDFLARE_ACCOUNT_ID)\n' +
            '  --api-token (or CLOUDFLARE_API_TOKEN)',
        );
      }
    } else {
      if (!accountId || !accessKeyId || !secretAccessKey) {
        throw new Error(
          'Cloudflare credentials are required for listing buckets (R2 mode):\n' +
            '  --account-id (or CLOUDFLARE_ACCOUNT_ID)\n' +
            '  --access-key-id (or CLOUDFLARE_ACCESS_KEY_ID)\n' +
            '  --secret-access-key (or CLOUDFLARE_SECRET_ACCESS_KEY)',
        );
      }
    }

    return {
      imagesDir: '',
      config: {
        accountId,
        accessKeyId,
        secretAccessKey,
        apiToken,
        bucketName: bucketName || '',
        useApiToken,
      },
      listBucketsOnly: true,
    };
  }

  if (!imagesDir) {
    throw new Error('--images-dir is required (or set IMAGES_DIR env var)');
  }

  if (!accountId || !bucketName) {
    throw new Error(
      'Required:\n' +
        '  --account-id (or CLOUDFLARE_ACCOUNT_ID)\n' +
        '  --bucket-name (or CLOUDFLARE_BUCKET_NAME)',
    );
  }

  if (useApiToken) {
    if (!apiToken) {
      throw new Error(
        'When using API token mode, --api-token (or CLOUDFLARE_API_TOKEN) is required',
      );
    }
  } else {
    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'When using R2 mode, both are required:\n' +
          '  --access-key-id (or CLOUDFLARE_ACCESS_KEY_ID)\n' +
          '  --secret-access-key (or CLOUDFLARE_SECRET_ACCESS_KEY)\n\n' +
          'Or use API token mode:\n' +
          '  --api-token (or CLOUDFLARE_API_TOKEN)',
      );
    }
  }

  return {
    imagesDir: path.resolve(imagesDir),
    config: {
      accountId,
      accessKeyId,
      secretAccessKey,
      apiToken,
      bucketName,
      useApiToken,
    },
    listBucketsOnly: false,
  };
}

async function main() {
  try {
    const { imagesDir, config, listBucketsOnly } = parseArgs();

    // Handle list-buckets mode
    if (listBucketsOnly) {
      process.stdout.write('=== Listing Cloudflare R2 Buckets ===\n');
      if (config.bucketName) {
        process.stdout.write(`Checking for bucket: ${config.bucketName}\n`);
      }
      process.stdout.write('\n');
      await listBuckets(config);
      return;
    }

    process.stdout.write('=== OneFit Image Upload to Cloudflare ===\n');
    process.stdout.write(`Images Directory: ${imagesDir}\n`);
    process.stdout.write(`Bucket/Namespace: ${config.bucketName}\n`);
    process.stdout.write(
      `Mode: ${config.useApiToken ? 'Cloudflare Images API (API Token)' : 'R2 (Access Keys)'}\n\n`,
    );

    // Verify access before starting uploads
    process.stdout.write('Verifying access...\n');
    try {
      await verifyBucketExists(config);
      if (config.useApiToken) {
        process.stdout.write(`✓ Cloudflare Images API access verified\n\n`);
      } else {
        process.stdout.write(`✓ Bucket "${config.bucketName}" is accessible\n\n`);
      }
    } catch (bucketError: any) {
      process.stderr.write(`\n❌ Validation failed:\n${bucketError.message}\n\n`);
      if (!config.useApiToken) {
        process.stderr.write(
          'Tip: Use --list-buckets to see available buckets:\n' +
            '  tsx scripts/upload-images-to-cloudflare.ts \\\n' +
            '    --list-buckets \\\n' +
            '    --account-id "your-account-id" \\\n' +
            '    --access-key-id "your-access-key" \\\n' +
            '    --secret-access-key "your-secret-key"\n\n',
        );
      }
      process.exit(1);
    }

    await uploadImages(imagesDir, config);

    process.stdout.write('\nUpload process completed.\n');
  } catch (error: any) {
    process.stderr.write(`Error: ${error.message}\n`);
    if (error.stack) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.stderr.write(
      '\nUsage (R2 mode with access keys):\n' +
        '  tsx scripts/upload-images-to-cloudflare.ts \\\n' +
        '    --images-dir "./downloaded-images" \\\n' +
        '    --account-id "your-account-id" \\\n' +
        '    --access-key-id "your-access-key" \\\n' +
        '    --secret-access-key "your-secret-key" \\\n' +
        '    --bucket-name "your-bucket-name"\n\n' +
        'Usage (Cloudflare Images API mode with API token):\n' +
        '  tsx scripts/upload-images-to-cloudflare.ts \\\n' +
        '    --images-dir "./downloaded-images" \\\n' +
        '    --account-id "your-account-id" \\\n' +
        '    --api-token "your-api-token" \\\n' +
        '    --bucket-name "your-namespace"\n\n' +
        'List available R2 buckets:\n' +
        '  tsx scripts/upload-images-to-cloudflare.ts \\\n' +
        '    --list-buckets \\\n' +
        '    --account-id "your-account-id" \\\n' +
        '    --access-key-id "your-access-key" \\\n' +
        '    --secret-access-key "your-secret-key"\n\n' +
        'Or set environment variables:\n' +
        '  IMAGES_DIR, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_BUCKET_NAME\n' +
        '  For R2: CLOUDFLARE_ACCESS_KEY_ID, CLOUDFLARE_SECRET_ACCESS_KEY\n' +
        '  For Images API: CLOUDFLARE_API_TOKEN\n',
    );
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
