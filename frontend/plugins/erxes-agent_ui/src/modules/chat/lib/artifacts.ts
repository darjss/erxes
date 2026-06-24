import { REACT_APP_API_URL, type ChartSpec } from 'erxes-ui';
import type { ToolPartView } from '~/modules/chat/lib/uiParts';

// Reads the structured artifact a tool returns and turns it into something the
// chat can show (an ArtifactCard inline + the Preview panel). Mirrors the
// backend contract at backend/plugins/erxes-agent_api/src/mastra/tools/artifacts.ts

export type DocumentFormat = 'pdf' | 'docx' | 'xlsx';

export interface ChartArtifact {
  id: string;
  kind: 'chart';
  title: string;
  spec: ChartSpec;
}

export interface DocumentArtifact {
  id: string;
  kind: 'document';
  format: DocumentFormat;
  title: string;
  fileName: string;
  mimeType: string;
  // Storage key (read via core's /read-file) OR an inline data:/http URL.
  fileKey: string;
  inline?: boolean;
  size?: number;
}

export type Artifact = ChartArtifact | DocumentArtifact;

const isDocumentFormat = (value: unknown): value is DocumentFormat =>
  value === 'pdf' || value === 'docx' || value === 'xlsx';

/** Pull a valid artifact off a tool result, or null when there isn't one. */
export const asArtifact = (output: unknown): Artifact | null => {
  const artifact = (output as { artifact?: unknown })?.artifact as
    | Record<string, unknown>
    | undefined;
  if (!artifact || typeof artifact !== 'object') return null;

  if (artifact.kind === 'chart') {
    const spec = artifact.spec as ChartSpec | undefined;
    if (!spec || !Array.isArray(spec.series) || !Array.isArray(spec.data)) {
      return null;
    }
    return {
      id: String(artifact.id ?? ''),
      kind: 'chart',
      title: String(artifact.title ?? spec.title ?? 'Chart'),
      spec,
    };
  }

  if (artifact.kind === 'document' && isDocumentFormat(artifact.format)) {
    return {
      id: String(artifact.id ?? ''),
      kind: 'document',
      format: artifact.format,
      title: String(artifact.title ?? 'Document'),
      fileName: String(artifact.fileName ?? 'document'),
      mimeType: String(artifact.mimeType ?? ''),
      fileKey: String(artifact.fileKey ?? ''),
      inline: Boolean(artifact.inline),
      size: typeof artifact.size === 'number' ? artifact.size : undefined,
    };
  }

  return null;
};

/** The artifact carried by a tool part's output (settled tool calls only). */
export const asArtifactPart = (call: ToolPartView): Artifact | null => {
  if (call.isError || call.state !== 'output-available') return null;
  return asArtifact(call.output);
};

/** A URL the browser can open/download for a document artifact. */
export const documentUrl = (artifact: DocumentArtifact): string => {
  const { fileKey, fileName } = artifact;
  if (artifact.inline || /^(https?:|data:)/i.test(fileKey)) return fileKey;
  return `${REACT_APP_API_URL}/read-file?key=${encodeURIComponent(
    fileKey,
  )}&inline=true&name=${encodeURIComponent(fileName)}`;
};
