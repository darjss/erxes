import { readImage } from 'erxes-ui';

interface ImageUrlOptions {
  isSlaveMode: boolean;
  masterUrl?: string;
}

export function getImageUrl(
  imageUrl: string | undefined,
  options: ImageUrlOptions,
): string | undefined {
  if (!imageUrl) return undefined;

  const { isSlaveMode, masterUrl } = options;

  if (isSlaveMode && masterUrl) {
    const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${masterUrl}${normalizedPath}`;
  }

  return imageUrl;
}

export function getImageReadUrl(
  imageKey: string | undefined,
  options: ImageUrlOptions,
): string {
  if (!imageKey) {
    console.log('url 1 ============================>', 'no image key');

    return '';
  }

  const { isSlaveMode, masterUrl } = options;

  if (isSlaveMode && masterUrl) {
    const normalizedKey = imageKey.startsWith('/') ? imageKey : `/${imageKey}`;
    const encodedKey = encodeURIComponent(normalizedKey);
    const url = readImage(`${masterUrl}/read-file?key=${encodedKey}`);
    console.log('url 2', url);
    return url;
  }

  const url = readImage(`${imageKey}`);
  console.log('url  3============================>', url);
  return url;
}

export function extractImageKey(url: string, options: ImageUrlOptions): string {
  const { isSlaveMode, masterUrl } = options;

  if (isSlaveMode && masterUrl && url.startsWith(masterUrl)) {
    return url.replace(masterUrl, '').replace(/^\//, '');
  }

  return url;
}
