import { IconSparkles } from '@tabler/icons-react';
import { Breadcrumb, Button, PageContainer, ScrollArea } from 'erxes-ui';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  isLockedCompanyBrainModuleSlug,
  LOCKED_COMPANY_BRAIN_MODULE_MAP,
} from '~/modules/company-brain/constants/lockedCompanyBrainModules';

const PreviewPill = ({ label }: { label: string }) => {
  return (
    <div className="rounded-full border border-border/70 bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground">
      {label}
    </div>
  );
};

const PreviewCard = ({
  title,
  body,
  accentClass,
}: {
  title: string;
  body: string;
  accentClass: string;
}) => {
  return (
    <div className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className={`h-1.5 w-16 rounded-full ${accentClass}`} />
      <div className="mt-4 text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-2 text-xs leading-5 text-muted-foreground">{body}</div>
    </div>
  );
};

const PreviewMetric = ({
  label,
  value,
  accentClass,
}: {
  label: string;
  value: string;
  accentClass: string;
}) => {
  return (
    <div className="rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold text-foreground">{value}</div>
      <div className="mt-3 h-2 rounded-full bg-muted">
        <div className={`h-full w-2/3 rounded-full ${accentClass}`} />
      </div>
    </div>
  );
};

const CeoPreview = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Executive cockpit
            </div>
            <div className="mt-2 text-2xl font-semibold text-foreground">
              CEO strategic overview
            </div>
          </div>
          <div className="flex gap-2">
            <PreviewPill label="Board brief" />
            <PreviewPill label="6 priorities" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <PreviewMetric
            label="Growth"
            value="+18.4%"
            accentClass="bg-sky-500"
          />
          <PreviewMetric
            label="Risk alerts"
            value="03"
            accentClass="bg-amber-500"
          />
          <PreviewMetric
            label="Decisions"
            value="11"
            accentClass="bg-emerald-500"
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PreviewCard
            title="Morning board memo"
            body="Revenue swing, margin shifts, and expansion blockers summarized for the leadership team."
            accentClass="bg-sky-500"
          />
          <PreviewCard
            title="Decision queue"
            body="Capital requests, hiring approvals, and unresolved escalations prioritized by business impact."
            accentClass="bg-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <PreviewCard
          title="Investor narrative"
          body="AI-generated talking points connecting operational changes to quarterly outcomes."
          accentClass="bg-violet-500"
        />
        <PreviewCard
          title="Cross-team pulse"
          body="Sales, finance, and operations activity merged into one executive signal stream."
          accentClass="bg-rose-500"
        />
        <PreviewCard
          title="Scenario planner"
          body="Best-case, base-case, and risk-case options drafted with likely downstream effects."
          accentClass="bg-amber-500"
        />
      </div>
    </div>
  );
};

const DesignPreview = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.35fr]">
      <div className="space-y-4">
        <div className="rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-sm">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Creative system
          </div>
          <div className="mt-2 text-2xl font-semibold text-foreground">
            Design department workspace
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <PreviewPill label="Brand guardrails" />
            <PreviewPill label="Asset queue" />
            <PreviewPill label="Campaign reviews" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-border/70 bg-[#F7D66B]/70 p-5 shadow-sm">
            <div className="h-24 rounded-2xl bg-[#F2A65A]" />
            <div className="mt-4 text-sm font-semibold text-foreground">
              Palette direction
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-[#B7E3CC]/70 p-5 shadow-sm">
            <div className="h-24 rounded-2xl bg-[#5FC9A6]" />
            <div className="mt-4 text-sm font-semibold text-foreground">
              Motion language
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-[#F6B3C8]/70 p-5 shadow-sm">
            <div className="h-24 rounded-2xl bg-[#E36BAE]" />
            <div className="mt-4 text-sm font-semibold text-foreground">
              Concept board
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-[#C4C8FF]/70 p-5 shadow-sm">
            <div className="h-24 rounded-2xl bg-[#7A7FF0]" />
            <div className="mt-4 text-sm font-semibold text-foreground">
              UI kit sync
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <PreviewMetric
            label="Drafts"
            value="26"
            accentClass="bg-[#E36BAE]"
          />
          <PreviewMetric
            label="Reviews"
            value="09"
            accentClass="bg-[#7A7FF0]"
          />
          <PreviewMetric
            label="Ready"
            value="14"
            accentClass="bg-[#5FC9A6]"
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PreviewCard
            title="Launch visual pass"
            body="Creative briefs, reusable blocks, and stakeholder comments aligned inside one review lane."
            accentClass="bg-[#E36BAE]"
          />
          <PreviewCard
            title="System tokens"
            body="Color, type, and spacing recommendations proposed from recent product and campaign work."
            accentClass="bg-[#7A7FF0]"
          />
          <PreviewCard
            title="Ad concept clusters"
            body="Generated explorations grouped by tone, audience, and channel constraints."
            accentClass="bg-[#F2A65A]"
          />
          <PreviewCard
            title="Production handoff"
            body="Approved layouts, copy states, and final file sets staged for delivery."
            accentClass="bg-[#5FC9A6]"
          />
        </div>
      </div>
    </div>
  );
};

const KnowledgePreview = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_1.2fr]">
      <div className="rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Knowledge graph
            </div>
            <div className="mt-2 text-2xl font-semibold text-foreground">
              Organizational memory hub
            </div>
          </div>
          <PreviewPill label="1,284 linked docs" />
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
            <div className="text-sm font-semibold text-foreground">
              Sales onboarding playbook
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Connected to call scripts, pricing notes, product objections, and renewal flows.
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
            <div className="text-sm font-semibold text-foreground">
              Product launch archive
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Linked to release notes, customer feedback, design assets, and postmortems.
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
            <div className="text-sm font-semibold text-foreground">
              Internal policy center
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Cross-referenced with legal checklists, HR exceptions, and governance updates.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <PreviewMetric
            label="Search hits"
            value="92%"
            accentClass="bg-cyan-500"
          />
          <PreviewMetric
            label="Fresh docs"
            value="48"
            accentClass="bg-blue-500"
          />
          <PreviewMetric
            label="Sources"
            value="17"
            accentClass="bg-indigo-500"
          />
        </div>

        <PreviewCard
          title="AI answer trail"
          body="Every response is backed by linked source notes, owners, and last-updated context."
          accentClass="bg-cyan-500"
        />
        <PreviewCard
          title="Department collections"
          body="Operations, product, revenue, and legal knowledge organized into reusable answer packs."
          accentClass="bg-blue-500"
        />
        <PreviewCard
          title="Knowledge gaps"
          body="Missing documentation surfaces automatically when repeated questions lack strong source coverage."
          accentClass="bg-indigo-500"
        />
      </div>
    </div>
  );
};

const LegalPreview = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
      <div className="rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Counsel operations
            </div>
            <div className="mt-2 text-2xl font-semibold text-foreground">
              Legal review desk
            </div>
          </div>
          <div className="flex gap-2">
            <PreviewPill label="Contracts" />
            <PreviewPill label="Policies" />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-border/70">
          <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr] bg-muted/70 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <div>Document</div>
            <div>Status</div>
            <div>Risk</div>
          </div>
          <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr] border-t border-border/70 bg-card/90 px-4 py-4 text-sm">
            <div className="font-medium text-foreground">MSA renewal draft</div>
            <div className="text-muted-foreground">In review</div>
            <div className="text-amber-600">Medium</div>
          </div>
          <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr] border-t border-border/70 bg-card/90 px-4 py-4 text-sm">
            <div className="font-medium text-foreground">Vendor DPA update</div>
            <div className="text-muted-foreground">Pending</div>
            <div className="text-rose-600">High</div>
          </div>
          <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr] border-t border-border/70 bg-card/90 px-4 py-4 text-sm">
            <div className="font-medium text-foreground">Workplace policy v3</div>
            <div className="text-muted-foreground">Approved</div>
            <div className="text-emerald-600">Low</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <PreviewMetric
            label="Clauses flagged"
            value="37"
            accentClass="bg-rose-500"
          />
          <PreviewMetric
            label="Turnaround"
            value="2.1d"
            accentClass="bg-amber-500"
          />
        </div>

        <PreviewCard
          title="Policy cross-check"
          body="Operational requests are matched against internal policy language before final approval."
          accentClass="bg-amber-500"
        />
        <PreviewCard
          title="Negotiation memory"
          body="Prior edits, fallback clauses, and counterparty redlines grouped by agreement type."
          accentClass="bg-rose-500"
        />
        <PreviewCard
          title="Compliance prompts"
          body="Missing approvals, signature gaps, and jurisdiction notes are surfaced automatically."
          accentClass="bg-emerald-500"
        />
      </div>
    </div>
  );
};

const LockedPreviewContent = ({
  slug,
}: {
  slug: keyof typeof LOCKED_COMPANY_BRAIN_MODULE_MAP;
}) => {
  switch (slug) {
    case 'ceo-team':
      return <CeoPreview />;
    case 'design-department':
      return <DesignPreview />;
    case 'knowledge-hub':
      return <KnowledgePreview />;
    case 'legal-department':
      return <LegalPreview />;
  }
};

export const LockedCompanyBrainModulePage = () => {
  const { lockedModuleSlug } = useParams();

  if (!isLockedCompanyBrainModuleSlug(lockedModuleSlug)) {
    return <Navigate to="/agent/assistant" replace />;
  }

  const module = LOCKED_COMPANY_BRAIN_MODULE_MAP[lockedModuleSlug];
  const ModuleIcon = module.icon;

  return (
    <PageContainer>
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
        <div
          className="flex h-full min-h-0 flex-col pointer-events-none select-none"
          style={{
            filter: 'blur(8px)',
            WebkitFilter: 'blur(8px)',
            transform: 'scale(1.01)',
            opacity: 0.62,
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
            <Breadcrumb>
              <Breadcrumb.List className="gap-1">
                <Breadcrumb.Item>
                  <Button variant="ghost" asChild>
                    <Link to={`/agent/${module.slug}`}>
                      <ModuleIcon />
                      {module.name}
                    </Link>
                  </Button>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>

            <div className="flex items-center gap-2">
              <PreviewPill label="Enterprise preview" />
              <PreviewPill label="Frontend only" />
            </div>
          </div>

          <ScrollArea className="flex-auto">
            <div className="min-h-[820px] overflow-hidden bg-gradient-to-br from-background via-muted/40 to-background px-5 py-6">
              <LockedPreviewContent slug={lockedModuleSlug} />
            </div>
          </ScrollArea>
        </div>

        <div
          className="absolute inset-0 z-10 grid place-items-center bg-background/42"
        >
          <div className="mx-auto w-full max-w-sm px-6 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <IconSparkles className="size-6 text-primary" />
            </div>
            <div className="mt-4 text-lg font-medium tracking-tight text-foreground">
              Enterprise
            </div>
            <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Please upgradeto the Enterprise plan to access this feature.
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
