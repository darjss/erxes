import {
  Avatar,
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Sidebar,
  Spinner,
  Table,
  Tabs,
  useQueryState,
} from 'erxes-ui';
import { IconBuildingStore } from '@tabler/icons-react';
import { useCollectiveDetail } from '../hooks/useCollectiveDetail';
import { humanizeSyncError } from '../utils/humanizeSyncError';
import {
  ICollective,
  ICollectiveSupplier,
  ICollectiveSyncResult,
} from '../types';

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'failed') return 'destructive' as const;
  if (status === 'syncing') return 'info' as const;
  return 'secondary' as const;
};

const verificationVariant = (status?: string) => {
  if (status === 'verified') return 'success' as const;
  if (status === 'unverified') return 'destructive' as const;
  return 'secondary' as const;
};

const Row = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) => (
  <Table.Row>
    <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
      {label}
    </Table.Cell>
    <Table.Cell className="p-2 h-auto min-h-10 whitespace-normal">
      {value ?? '-'}
    </Table.Cell>
  </Table.Row>
);

const SupplierLine = ({
  supplier,
  fallbackId,
}: {
  supplier?: ICollectiveSupplier | null;
  fallbackId: string;
}) => (
  <Table.Row>
    <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
      Supplier
    </Table.Cell>
    <Table.Cell className="p-2 h-auto min-h-10 whitespace-normal">
      {supplier?.name || fallbackId}
    </Table.Cell>
  </Table.Row>
);

const CollectiveOverview = ({ collective }: { collective: ICollective }) => {
  const {
    name,
    description,
    targetSubdomain,
    supplierIds = [],
    suppliers = [],
    status,
    totalCreated,
    totalFailed,
    lastSyncedAt,
    createdAt,
    updatedAt,
    createdBy,
  } = collective;

  return (
    <div className="flex flex-col gap-4 p-4">
      <InfoCard title="General">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="Name" value={name} />
              <Row label="Description" value={description} />
              <Row label="Target subdomain" value={targetSubdomain} />
              <Row label="Suppliers" value={supplierIds.length} />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
                  Status
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  <Badge variant={statusVariant(status)}>
                    {status || 'pending'}
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Row label="Created products" value={totalCreated ?? 0} />
              <Row label="Failed products" value={totalFailed ?? 0} />
              <Row
                label="Last sync"
                value={
                  lastSyncedAt
                    ? new Date(lastSyncedAt).toLocaleString()
                    : undefined
                }
              />
              <Row label="Created by" value={createdBy} />
              <Row
                label="Created"
                value={
                  createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : undefined
                }
              />
              <Row
                label="Updated"
                value={
                  updatedAt
                    ? new Date(updatedAt).toLocaleDateString()
                    : undefined
                }
              />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      {suppliers.length > 0 && (
        <InfoCard title="Suppliers">
          <InfoCard.Content className="shadow-none p-0 overflow-hidden">
            <Table>
              <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
                {suppliers.map((s) => (
                  <SupplierLine supplier={s} fallbackId={s._id} />
                ))}
              </Table.Body>
            </Table>
          </InfoCard.Content>
        </InfoCard>
      )}
    </div>
  );
};

const ErrorList = ({ errors }: { errors: string[] }) => {
  const grouped = errors.map(humanizeSyncError);
  const buckets = new Map<
    string,
    { reason: string; codes: string[]; raws: string[] }
  >();
  for (const e of grouped) {
    const bucket = buckets.get(e.reason) ?? {
      reason: e.reason,
      codes: [],
      raws: [],
    };
    if (e.productCode) bucket.codes.push(e.productCode);
    bucket.raws.push(e.raw);
    buckets.set(e.reason, bucket);
  }

  return (
    <ul className="space-y-2 text-xs">
      {Array.from(buckets.values()).map((b, i) => (
        <li key={i} className="space-y-1">
          <div className="font-medium">{b.reason}</div>
          {b.codes.length > 0 && (
            <div className="text-muted-foreground" title={b.raws.join('\n')}>
              Affected products: {b.codes.slice(0, 8).join(', ')}
              {b.codes.length > 8 && ` (+${b.codes.length - 8} more)`}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const SyncResultCard = ({ result }: { result: ICollectiveSyncResult }) => {
  const {
    supplierId,
    supplier,
    subdomain,
    total,
    created,
    failed,
    errors = [],
  } = result;
  const title = supplier?.name || subdomain || supplierId;

  return (
    <InfoCard title={title}>
      <InfoCard.Content className="shadow-none p-0 overflow-hidden">
        <Table>
          <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
            <SupplierLine supplier={supplier} fallbackId={supplierId} />
            {subdomain && <Row label="Subdomain" value={subdomain} />}
            <Table.Row>
              <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
                Total
              </Table.Cell>
              <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                <Badge variant="default">{total ?? 0}</Badge>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
                Created
              </Table.Cell>
              <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                <Badge variant="success">{created ?? 0}</Badge>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="bg-sidebar p-2 w-40 h-auto min-h-10 text-muted-foreground">
                Failed
              </Table.Cell>
              <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                {(failed ?? 0) > 0 ? (
                  <Badge variant="destructive">{failed}</Badge>
                ) : (
                  <Badge variant="secondary">0</Badge>
                )}
              </Table.Cell>
            </Table.Row>
            {errors.length > 0 && (
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-40 text-muted-foreground align-top">
                  What went wrong
                </Table.Cell>
                <Table.Cell className="p-2 whitespace-normal">
                  <ErrorList errors={errors} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </InfoCard.Content>
    </InfoCard>
  );
};

const CollectiveSyncResults = ({ collective }: { collective: ICollective }) => {
  const results = collective.syncResults || [];

  if (results.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">No sync results yet.</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {results.map((r) => (
        <SyncResultCard key={r.supplierId} result={r} />
      ))}
    </div>
  );
};

const TABS = ['overview', 'sync'] as const;
type Tab = (typeof TABS)[number];

const tabLabel: Record<Tab, string> = {
  overview: 'Overview',
  sync: 'Sync results',
};

export const CollectiveDetailSheet = () => {
  const [activeCollectiveId, setActiveCollectiveId] =
    useQueryState<string>('activeCollectiveId');
  const [tab, setTab] = useQueryState<string>('collectiveTab');
  const { collective, loading } = useCollectiveDetail(activeCollectiveId);

  const activeTab = (tab ?? 'overview') as Tab;

  return (
    <FocusSheet
      open={!!activeCollectiveId}
      onOpenChange={() => setActiveCollectiveId(null)}
    >
      <FocusSheet.View className="w-[50%] md:w-[50%]">
        <FocusSheet.Header title={collective?.name || 'Collective Detail'} />
        <FocusSheet.Content className="flex flex-row flex-auto min-h-0 overflow-hidden">
          <FocusSheet.SideBar>
            <Sidebar.Content>
              <Sidebar.Group>
                <Sidebar.GroupContent className="mt-2">
                  <Sidebar.Menu>
                    {TABS.map((t) => (
                      <Sidebar.MenuItem key={t}>
                        <Sidebar.MenuButton
                          isActive={activeTab === t}
                          onClick={() => setTab(t)}
                        >
                          {tabLabel[t]}
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    ))}
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
            </Sidebar.Content>
          </FocusSheet.SideBar>

          <div className="flex flex-col flex-1 min-w-0 min-h-0">
            <Tabs
              value={activeTab}
              onValueChange={setTab}
              className="flex flex-col flex-1 min-h-0"
            >
              <Tabs.Content
                value="overview"
                className="data-[state=active]:flex flex-col flex-1 min-h-0"
              >
                <ScrollArea className="flex-1 min-h-0">
                  {loading && (
                    <div className="p-4">
                      <Spinner />
                    </div>
                  )}
                  {!loading && collective && (
                    <CollectiveOverview collective={collective} />
                  )}
                  {!loading && !collective && (
                    <div className="p-4">Collective not found</div>
                  )}
                </ScrollArea>
              </Tabs.Content>

              <Tabs.Content
                value="sync"
                className="data-[state=active]:flex flex-col flex-1 min-h-0"
              >
                <ScrollArea className="flex-1 min-h-0">
                  {loading && (
                    <div className="p-4">
                      <Spinner />
                    </div>
                  )}
                  {!loading && collective && (
                    <CollectiveSyncResults collective={collective} />
                  )}
                </ScrollArea>
              </Tabs.Content>
            </Tabs>

            <Sheet.Footer className="flex-none border-t">
              <Sheet.Close asChild>
                <Button variant="secondary" className="bg-border">
                  Close
                </Button>
              </Sheet.Close>
            </Sheet.Footer>
          </div>
        </FocusSheet.Content>
      </FocusSheet.View>
    </FocusSheet>
  );
};
