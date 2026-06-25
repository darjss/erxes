// HTTP-layer tests for the Chimege client: transcodeToWav and global.fetch are
// mocked so we exercise the size guard and the failure→ExpectedError mapping
// without touching ffmpeg or the network. concatWav stays real.
jest.mock('../audio', () => {
  const actual = jest.requireActual('../audio');
  return { ...actual, transcodeToWav: jest.fn() };
});

import { transcodeToWav } from '../audio';
import { synthesize, transcribe } from '../chimegeVoice';

const mockTranscode = transcodeToWav as jest.Mock;

function smallWav(): Buffer {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.write('data', 36);
  return Buffer.concat([h, Buffer.alloc(64, 1)]);
}

function fakeResponse(opts: {
  ok: boolean;
  status: number;
  errorCode?: string;
  body?: string;
  bytes?: Buffer;
}) {
  return {
    ok: opts.ok,
    status: opts.status,
    headers: {
      get: (k: string) =>
        k === 'Error-Code' ? (opts.errorCode ?? null) : null,
    },
    text: async () => opts.body ?? '',
    arrayBuffer: async () =>
      (opts.bytes ?? Buffer.alloc(0)).buffer.slice(0),
  } as unknown as Response;
}

describe('transcribe (HTTP)', () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    mockTranscode.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('rejects an over-bound WAV before calling the API', async () => {
    mockTranscode.mockResolvedValue(Buffer.alloc(4 * 1024 * 1024)); // > 3MB
    await expect(
      transcribe({ token: 't', audio: Buffer.from('x') }),
    ).rejects.toThrow(/too long/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps a non-ok response to an ExpectedError with status + Error-Code', async () => {
    mockTranscode.mockResolvedValue(smallWav());
    fetchMock.mockResolvedValue(
      fakeResponse({
        ok: false,
        status: 403,
        errorCode: '1000',
        body: 'invalid token',
      }),
    );
    await expect(
      transcribe({ token: 'bad', audio: Buffer.from('x') }),
    ).rejects.toThrow(/Transcription failed \(403, code 1000\)/);
  });

  it('returns the trimmed transcript on success', async () => {
    mockTranscode.mockResolvedValue(smallWav());
    fetchMock.mockResolvedValue(
      fakeResponse({ ok: true, status: 200, body: '  сайн байна  ' }),
    );
    await expect(
      transcribe({ token: 't', audio: Buffer.from('x') }),
    ).resolves.toBe('сайн байна');
  });
});

describe('synthesize (HTTP)', () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('maps a non-ok response to an ExpectedError with status + Error-Code', async () => {
    fetchMock.mockResolvedValue(
      fakeResponse({ ok: false, status: 400, errorCode: '4002', body: 'too long' }),
    );
    await expect(
      synthesize({ token: 't', voice: 'FEMALE3v2', text: 'тест' }),
    ).rejects.toThrow(/Speech synthesis failed \(400, code 4002\)/);
  });

  it('throws when there is no speakable text', async () => {
    await expect(
      synthesize({ token: 't', voice: 'FEMALE3v2', text: '12345 ***' }),
    ).rejects.toThrow(/No speakable text/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
