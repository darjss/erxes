// ---------------------------------------------------------------------------
// Audio plumbing for the Chimege voice routes. Two concerns the provider needs
// but Chimege itself does not solve:
//
//   transcodeToWav() — the browser MediaRecorder emits webm/opus, but Chimege
//     STT wants WAV (16kHz mono PCM is the safe, documented input). We shell
//     out to ffmpeg (no npm dependency) and write to a real temp file so the
//     RIFF header sizes are finalised correctly (a non-seekable pipe leaves
//     placeholder sizes that some decoders reject).
//
//   concatWav() — Chimege TTS caps a request at 300 normalised chars, so a long
//     reply is synthesised in chunks. Each chunk comes back as its own WAV;
//     this stitches the PCM payloads under one canonical header so the client
//     plays a single continuous clip.
//
// Failures surface as ExpectedError so the routes return a clean 4xx/5xx.
// ---------------------------------------------------------------------------

import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ExpectedError } from 'erxes-api-shared/utils';

// Default ceiling on decoded audio duration. A tiny opus stream can decode to
// gigabytes of PCM, so bound it at the SOURCE (ffmpeg) rather than after the
// fact — 120s @ 16kHz mono 16-bit ≈ 3.8MB.
const DEFAULT_MAX_DURATION_SEC = 120;

export interface TranscodeOptions {
  sampleRate?: number;
  channels?: number;
  // Hard cap on decoded duration (ffmpeg -t). Defaults to 120s.
  maxDurationSec?: number;
  // Hard cap on the WAV output size in bytes (ffmpeg -fs). Stops writing once
  // hit, so no request can balloon disk/RAM regardless of input.
  maxBytes?: number;
}

/** Transcode arbitrary recorded audio (webm/opus/mp4/…) to mono 16-bit PCM
 *  WAV at the requested sample rate via ffmpeg. Output is bounded at the source
 *  by duration (-t) and, when given, by byte size (-fs). */
export async function transcodeToWav(
  input: Buffer,
  opts: TranscodeOptions = {},
): Promise<Buffer> {
  const sampleRate = opts.sampleRate ?? 16000;
  const channels = opts.channels ?? 1;
  const maxDurationSec = opts.maxDurationSec ?? DEFAULT_MAX_DURATION_SEC;
  // Read the binary at call time so FFMPEG_PATH (and tests) are honoured.
  const ffmpegBin = process.env.FFMPEG_PATH || 'ffmpeg';
  const outPath = join(tmpdir(), `erxes-voice-${randomUUID()}.wav`);

  const args = [
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    'pipe:0',
    '-ac',
    String(channels),
    '-ar',
    String(sampleRate),
    '-t',
    String(maxDurationSec),
    ...(opts.maxBytes ? ['-fs', String(opts.maxBytes)] : []),
    '-acodec',
    'pcm_s16le',
    '-f',
    'wav',
    '-y',
    outPath,
  ];

  // One finally wraps BOTH the spawn and the read, so the temp WAV is removed
  // on every exit path (ffmpeg spawn error, non-zero exit, or read failure) —
  // ffmpeg creates the file as soon as it writes the RIFF header.
  try {
    await new Promise<void>((resolve, reject) => {
      const proc = spawn(ffmpegBin, args);
      let stderr = '';
      proc.on('error', (err) =>
        reject(
          new ExpectedError(
            `Audio transcoding is unavailable (ffmpeg): ${(err as Error).message}`,
          ),
        ),
      );
      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });
      proc.on('close', (code) => {
        if (code === 0) return resolve();
        reject(
          new ExpectedError(
            `Failed to transcode audio (ffmpeg exit ${code}). ${stderr.slice(0, 300)}`,
          ),
        );
      });
      // Swallow EPIPE if ffmpeg dies before consuming stdin; the close handler
      // above reports the real failure.
      proc.stdin.on('error', () => undefined);
      proc.stdin.end(input);
    });
    return await readFile(outPath);
  } finally {
    await unlink(outPath).catch(() => undefined);
  }
}

// Locate a RIFF subchunk by 4-char id, returning the byte range of its body.
function findChunk(
  buf: Buffer,
  id: string,
): { offset: number; size: number } | null {
  let off = 12; // skip "RIFF"<size>"WAVE"
  while (off + 8 <= buf.length) {
    const cid = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (cid === id) return { offset: off + 8, size };
    off += 8 + size + (size % 2); // chunks are word-aligned
  }
  return null;
}

function buildWavHeader(
  dataLen: number,
  fmt: { channels: number; sampleRate: number; bitsPerSample: number },
): Buffer {
  const { channels, sampleRate, bitsPerSample } = fmt;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLen, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE((sampleRate * channels * bitsPerSample) / 8, 28);
  header.writeUInt16LE((channels * bitsPerSample) / 8, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataLen, 40);
  return header;
}

/** Stitch multiple PCM-WAV buffers (same format) into one clip. Reads the
 *  format from the first part and concatenates every `data` payload under a
 *  single canonical 44-byte header. */
export function concatWav(parts: Buffer[]): Buffer {
  const valid = parts.filter((p) => p && p.length > 44);
  if (valid.length === 0) {
    throw new ExpectedError('No audio was produced.');
  }
  if (valid.length === 1) return valid[0];

  const first = valid[0];
  const fmt = findChunk(first, 'fmt ');
  if (!fmt) return first; // unparseable header — return the first clip as-is
  const channels = first.readUInt16LE(fmt.offset + 2);
  const sampleRate = first.readUInt32LE(fmt.offset + 4);
  const bitsPerSample = first.readUInt16LE(fmt.offset + 14);

  const datas = valid.map((p) => {
    const d = findChunk(p, 'data');
    return d ? p.subarray(d.offset, d.offset + d.size) : Buffer.alloc(0);
  });
  const pcm = Buffer.concat(datas);
  return Buffer.concat([
    buildWavHeader(pcm.length, { channels, sampleRate, bitsPerSample }),
    pcm,
  ]);
}
