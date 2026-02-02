import {
  BinaryBitmap,
  HybridBinarizer,
  MultiFormatReader,
  RGBLuminanceSource,
  BarcodeFormat,
  DecodeHintType,
} from '@zxing/library';
import sharp from 'sharp';

export type DecodeQrResult =
  | { value: string }
  | { error: string };

function rgbaToLuminance(data: Buffer, width: number, height: number): Uint8ClampedArray {
  const size = width * height;
  const luminances = new Uint8ClampedArray(size);
  for (let i = 0; i < size; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    luminances[i] = ((r + g * 2 + b) / 4) & 0xff;
  }
  return luminances;
}

export async function decodeQrFromImagePath(
  filepath: string,
): Promise<DecodeQrResult> {
  try {
    const { data, info } = await sharp(filepath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.channels !== 4) {
      return { error: 'Invalid or unsupported image' };
    }

    const luminances = rgbaToLuminance(data, info.width, info.height);
    const luminanceSource = new RGBLuminanceSource(
      luminances,
      info.width,
      info.height,
    );
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    const reader = new MultiFormatReader();
    const result = reader.decode(binaryBitmap, hints);

    if (!result || !result.getText()) {
      return { error: 'No QR code found' };
    }

    return { value: result.getText() };
  } catch (e: unknown) {
    const err = e as { name?: string; message?: string };
    const isNotFound =
      err?.name === 'NotFoundException' ||
      (typeof err?.message === 'string' && err.message.toLowerCase().includes('not found'));
    return {
      error: isNotFound ? 'No QR code found' : 'Invalid or unsupported image',
    };
  }
}
