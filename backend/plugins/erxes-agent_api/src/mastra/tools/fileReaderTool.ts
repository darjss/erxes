import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { getCurrentAuth } from '~/mastra/requestContext';
import { fetchAttachmentBuffer } from '~/mastra/files/storage';
import { extractFileText } from '~/mastra/files/extract';

// ---------------------------------------------------------------------------
// file_reader — open a file as text. Two sources:
//   • key        — a file the USER attached (the storage key from the message's
//                  "Attached files" manifest), OR
//   • artifactId — a file the AGENT generated earlier this run (the id returned
//                  by generatePdf/Docx/Xlsx/Pptx). Lets a turn read back its own
//                  document, or read any persisted artifact.
//
// Supports pdf, docx, xlsx/xls, pptx, csv, txt, md, json, html. Images are
// already visible to the model — never use this for an image. Always bound (see
// agentRuntime), instance-local only (no external reach).
// ---------------------------------------------------------------------------

const readerOutput = z.object({
  name: z.string(),
  format: z.string(),
  characters: z.number(),
  truncated: z.boolean(),
  content: z.string(),
});

type ReaderResult = z.infer<typeof readerOutput>;

/** Decode a base64 (or percent-encoded) `data:` URL into bytes + content type. */
function decodeDataUrl(dataUrl: string): { buffer: Buffer; contentType: string } {
  const m = dataUrl.match(/^data:([^;,]*)(;base64)?,([\s\S]*)$/);
  if (!m) throw new Error('Malformed data URL');
  return {
    contentType: m[1] || 'application/octet-stream',
    buffer: m[2]
      ? Buffer.from(m[3], 'base64')
      : Buffer.from(decodeURIComponent(m[3]), 'utf8'),
  };
}

async function getModels(subdomain: string) {
  // Lazy import avoids a module cycle (connectionResolvers → … → builtins).
  const { generateModels } = await import('~/connectionResolvers');
  return generateModels(subdomain);
}

/** Read a file the user attached, by its storage key / URL. */
async function readByKey(
  subdomain: string,
  key: string,
  name?: string,
): Promise<ReaderResult> {
  const models = await getModels(subdomain);
  const settings = await models.MastraSettings.getSettings();
  const fileName = name || key.split('/').pop() || key;
  const { buffer, contentType } = await fetchAttachmentBuffer({
    erxesApiUrl: settings?.erxesApiUrl || 'http://localhost:4000',
    keyOrUrl: key,
    name: fileName,
  });
  const extracted = await extractFileText({
    buffer,
    name: fileName,
    mimeType: contentType,
  });
  return {
    name: fileName,
    format: extracted.format,
    characters: extracted.content.length,
    truncated: extracted.truncated,
    content: extracted.content,
  };
}

/** Read back an artifact the agent generated earlier this run, by its id. */
async function readByArtifactId(
  subdomain: string,
  artifactId: string,
): Promise<ReaderResult> {
  const models = await getModels(subdomain);
  const artifact = await models.MastraArtifact.getByArtifactId(artifactId);
  if (!artifact) {
    throw new Error(`No artifact found with id "${artifactId}".`);
  }

  // Chart artifacts carry no file — surface their spec as readable JSON.
  if (artifact.kind === 'chart') {
    const content = JSON.stringify(artifact.spec ?? {}, null, 2);
    return {
      name: artifact.title || artifactId,
      format: 'chart',
      characters: content.length,
      truncated: false,
      content,
    };
  }

  const fileKey = artifact.fileKey || '';
  const fileName = artifact.fileName || artifact.title || artifactId;
  let buffer: Buffer;
  let contentType: string;
  if (fileKey.startsWith('data:')) {
    ({ buffer, contentType } = decodeDataUrl(fileKey));
  } else {
    const settings = await models.MastraSettings.getSettings();
    ({ buffer, contentType } = await fetchAttachmentBuffer({
      erxesApiUrl: settings?.erxesApiUrl || 'http://localhost:4000',
      keyOrUrl: fileKey,
      name: fileName,
    }));
  }
  const extracted = await extractFileText({
    buffer,
    name: fileName,
    mimeType: artifact.mimeType || contentType,
  });
  return {
    name: fileName,
    format: extracted.format,
    characters: extracted.content.length,
    truncated: extracted.truncated,
    content: extracted.content,
  };
}

export const fileReaderTool = createTool({
  id: 'file-reader',
  description:
    'Read a file as text. Pass `artifactId` to read back a file you generated ' +
    'earlier this run (the id returned by generatePdf / generateDocx / ' +
    'generateXlsx / generatePptx), or `key` to read a file the user attached ' +
    "(the exact key from the message's \"Attached files\" manifest). Supports " +
    'pdf, docx, xlsx/xls, pptx, csv, txt, md, json and html. Images are already ' +
    'visible to you directly — never call this for an image.',
  inputSchema: z.object({
    key: z
      .string()
      .optional()
      .describe(
        'Storage key (or URL) of a file the USER attached, exactly as given in the Attached files manifest.',
      ),
    artifactId: z
      .string()
      .optional()
      .describe('Id of a file you generated earlier this run (from a generate tool result).'),
    name: z.string().optional().describe('File name, for friendlier errors.'),
  }),
  outputSchema: readerOutput,
  execute: async ({ key, artifactId, name }) => {
    const auth = getCurrentAuth();
    const subdomain = auth?.subdomain || 'localhost';
    if (artifactId) return readByArtifactId(subdomain, artifactId);
    if (key) return readByKey(subdomain, key, name);
    throw new Error(
      'Provide either an artifactId (a file you generated) or a key (a user attachment).',
    );
  },
});
