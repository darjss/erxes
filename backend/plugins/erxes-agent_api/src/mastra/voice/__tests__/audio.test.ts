import { transcodeToWav } from '../audio';

describe('transcodeToWav error paths', () => {
  const origFfmpeg = process.env.FFMPEG_PATH;
  afterEach(() => {
    if (origFfmpeg === undefined) delete process.env.FFMPEG_PATH;
    else process.env.FFMPEG_PATH = origFfmpeg;
  });

  it('throws a graceful ExpectedError when the ffmpeg binary is missing', async () => {
    process.env.FFMPEG_PATH = '/nonexistent/ffmpeg-does-not-exist';
    await expect(transcodeToWav(Buffer.from('whatever'))).rejects.toThrow(
      /transcoding is unavailable/i,
    );
  });

  it('throws an ExpectedError when ffmpeg exits non-zero on garbage input', async () => {
    delete process.env.FFMPEG_PATH; // use the real ffmpeg on PATH
    await expect(
      transcodeToWav(Buffer.from('this is not audio data')),
    ).rejects.toThrow(/Failed to transcode audio/i);
  });
});
