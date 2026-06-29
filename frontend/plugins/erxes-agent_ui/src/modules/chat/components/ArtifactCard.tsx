import { useEffect } from 'react';
import {
  IconChartBar,
  IconDownload,
  IconHierarchy,
  IconLayoutSidebarRightExpand,
  IconMaximize,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { EChart } from '~/modules/chat/charts';
import {
  artifactIcon,
  type Artifact,
  type ChartArtifact,
  type DiagramArtifact,
  type DocumentArtifact,
  documentUrl,
} from '~/modules/chat/lib/artifacts';
import { formatFileSize } from '~/modules/chat/lib/attachments';
import { previewStore } from '~/modules/chat/preview/previewStore';
import { MermaidViewer } from '~/modules/chat/preview/MermaidViewer';

// Registers the artifact in the Files list (without auto-opening the panel) on
// the first live render. Shared by all artifact card variants.
function usePresentIfLive(artifact: Artifact, live?: boolean) {
  const presentIfNew = previewStore((s) => s.presentIfNew);
  useEffect(() => { if (live) presentIfNew(artifact); }, [live, artifact, presentIfNew]);
}

// ── Chart card (inline EChart + open in preview) ──────────────────────────────
const ChartPreview = ({ artifact, live }: { artifact: ChartArtifact; live?: boolean }) => {
  const openArtifact = previewStore((s) => s.openArtifact);
  usePresentIfLive(artifact, live);

  return (
    <div className="ea-pop my-2 overflow-hidden rounded-xl border border-border/70 bg-background">
      {/* Card header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
        <IconChartBar className="size-4 text-primary shrink-0" />
        <p className="flex-1 min-w-0 truncate text-sm font-medium">{artifact.title}</p>
        <Button variant="ghost" size="sm" onClick={() => openArtifact(artifact)}>
          <IconLayoutSidebarRightExpand className="size-3.5" />
          Open
        </Button>
      </div>
      {/* Inline chart */}
      <div className="px-2 py-1" style={{ height: 380 }}>
        <EChart spec={artifact.spec} height="100%" />
      </div>
    </div>
  );
};

// ── Diagram card (inline Mermaid + open in preview) ───────────────────────────
const DiagramPreview = ({ artifact, live }: { artifact: DiagramArtifact; live?: boolean }) => {
  const openArtifact = previewStore((s) => s.openArtifact);
  usePresentIfLive(artifact, live);

  return (
    <div className="ea-pop my-2 overflow-hidden rounded-xl border border-border/70 bg-background">
      {/* Card header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
        <IconHierarchy className="size-4 text-primary shrink-0" />
        <p className="flex-1 min-w-0 truncate text-sm font-medium">{artifact.title}</p>
        <Button variant="ghost" size="sm" onClick={() => openArtifact(artifact)}>
          <IconLayoutSidebarRightExpand className="size-3.5" />
          Open
        </Button>
      </div>
      <div style={{ height: 300 }}>
        <MermaidViewer definition={artifact.definition} height="100%" />
      </div>
    </div>
  );
};

// ── Document card (no inline rendering — PDF/DOCX/XLSX aren't embeddable) ─────
const DocumentCard = ({ artifact, live }: { artifact: DocumentArtifact; live?: boolean }) => {
  const openArtifact = previewStore((s) => s.openArtifact);
  usePresentIfLive(artifact, live);

  const Icon = artifactIcon(artifact);
  const subtitle = [artifact.format.toUpperCase(), formatFileSize(artifact.size)]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="ea-pop my-2 flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 hover:border-border transition-colors">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{artifact.title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="secondary" size="sm" onClick={() => openArtifact(artifact)}>
          <IconMaximize className="size-3.5" />
          Open
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a href={documentUrl(artifact)} download={artifact.fileName} target="_blank" rel="noreferrer">
            <IconDownload className="size-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
};

// ── Router ────────────────────────────────────────────────────────────────────
export const ArtifactCard = ({ artifact, live }: { artifact: Artifact; live?: boolean }) => {
  if (artifact.kind === 'chart') return <ChartPreview artifact={artifact} live={live} />;
  if (artifact.kind === 'diagram') return <DiagramPreview artifact={artifact} live={live} />;
  return <DocumentCard artifact={artifact} live={live} />;
};
