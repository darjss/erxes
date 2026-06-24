import { useRef } from 'react';
import {
  IconArrowLeft,
  IconChartBar,
  IconDownload,
  IconExternalLink,
  IconFile,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeXls,
  IconX,
} from '@tabler/icons-react';
import { Button, EChart, type EChartHandle } from 'erxes-ui';
import {
  Artifact,
  DocumentArtifact,
  documentUrl,
} from '~/modules/chat/lib/artifacts';
import { formatFileSize } from '~/modules/chat/lib/attachments';
import { previewStore } from '~/modules/chat/preview/previewStore';
import { DocumentViewer } from '~/modules/chat/preview/DocumentViewer';
import { useThreadArtifacts } from '~/modules/chat/hooks/useThreadArtifacts';

const artifactIcon = (a: Artifact) => {
  if (a.kind === 'chart') return IconChartBar;
  if (a.format === 'pdf') return IconFileTypePdf;
  if (a.format === 'docx') return IconFileTypeDocx;
  return IconFileTypeXls;
};

// The Claude-artifacts-style side panel. Two views: a per-thread file list
// (persisted, survives reloads) and a single artifact (interactive chart or an
// inline document). Reads view/artifact from previewStore.
export const PreviewPanel = ({ threadId }: { threadId?: string }) => {
  const view = previewStore((s) => s.view);
  const artifact = previewStore((s) => s.artifact);
  const close = previewStore((s) => s.close);

  const showList = view === 'list' || !artifact;

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-background lg:static lg:z-auto lg:w-[42%] lg:min-w-[360px] lg:max-w-[680px] lg:border-l border-l">
      {showList ? (
        <FileListView threadId={threadId} onClose={close} />
      ) : (
        <ItemView artifact={artifact} onClose={close} />
      )}
    </div>
  );
};

// ── File list (grouped by chat instance / turn) ──────────────────────────────
const FileListView = ({
  threadId,
  onClose,
}: {
  threadId?: string;
  onClose: () => void;
}) => {
  const { artifacts, groups, loading } = useThreadArtifacts(threadId);
  const openArtifact = previewStore((s) => s.openArtifact);

  return (
    <>
      <div className="flex items-center gap-2 border-b px-4 py-2.5 shrink-0">
        <p className="min-w-0 flex-1 truncate text-sm font-medium">
          Files{artifacts.length ? ` · ${artifacts.length}` : ''}
        </p>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <IconX className="size-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {artifacts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <IconFile className="size-8 opacity-40" />
            <p className="text-sm">
              {loading ? 'Loading…' : 'No charts or documents yet.'}
            </p>
            <p className="text-xs">
              Ask the agent to chart data or generate a report.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group, gi) => (
              <div key={group.turnId} className="space-y-1.5">
                <p className="truncate px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.prompt || `Conversation ${gi + 1}`}
                </p>
                <ul className="space-y-1.5">
                  {group.items.map((a) => {
                    const Icon = artifactIcon(a);
                    const subtitle =
                      a.kind === 'chart'
                        ? 'Interactive chart'
                        : [a.format.toUpperCase(), formatFileSize(a.size)]
                            .filter(Boolean)
                            .join(' · ');
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          onClick={() => openArtifact(a)}
                          className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-accent/40"
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {a.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {subtitle}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// ── Single item ──────────────────────────────────────────────────────────────
const ItemView = ({
  artifact,
  onClose,
}: {
  artifact: Artifact;
  onClose: () => void;
}) => {
  const showList = previewStore((s) => s.showList);
  const chartRef = useRef<EChartHandle>(null);
  const typeLabel =
    artifact.kind === 'chart' ? 'Chart' : artifact.format.toUpperCase();

  return (
    <>
      <div className="flex items-center gap-2 border-b px-3 py-2.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={showList}
          aria-label="Back to files"
        >
          <IconArrowLeft className="size-4" />
        </Button>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {typeLabel}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{artifact.title}</p>
          {artifact.kind === 'chart' && artifact.spec.description && (
            <p
              className="truncate text-xs text-muted-foreground"
              title={artifact.spec.description}
            >
              {artifact.spec.description}
            </p>
          )}
        </div>
        {artifact.kind === 'chart' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => chartRef.current?.downloadPng(artifact.title)}
          >
            <IconDownload className="size-3.5" />
            PNG
          </Button>
        )}
        {artifact.kind === 'document' && <DocumentActions artifact={artifact} />}
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <IconX className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {artifact.kind === 'chart' ? (
          <div className="h-full w-full p-4">
            <EChart ref={chartRef} spec={artifact.spec} height="100%" />
          </div>
        ) : (
          <DocumentViewer artifact={artifact} />
        )}
      </div>
    </>
  );
};

const DocumentActions = ({ artifact }: { artifact: DocumentArtifact }) => {
  const url = documentUrl(artifact);
  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Open in new tab">
        <a href={url} target="_blank" rel="noreferrer">
          <IconExternalLink className="size-4" />
        </a>
      </Button>
      <Button asChild variant="secondary" size="sm">
        <a href={url} download={artifact.fileName} target="_blank" rel="noreferrer">
          <IconDownload className="size-3.5" />
          Download
        </a>
      </Button>
    </div>
  );
};
