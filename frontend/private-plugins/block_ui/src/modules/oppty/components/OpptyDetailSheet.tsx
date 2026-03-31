import { useGetOppty } from '@/oppty/hooks/useGetOppty';
import { useUpdateOppty } from '@/oppty/hooks/useUpdateOppty';
import { useBlockStatusesByType } from '@/status/hooks/useGetBlockStatuses';
import { useUnit } from '@/unit/hooks/useUnit';
import {
  useBuildings,
  useBuildingZonings,
} from '@/building/hooks/useBuildings';
import {
  Badge,
  Button,
  InfoCard,
  ScrollArea,
  FocusSheet,
  Sheet,
  Sidebar,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { format } from 'date-fns';
import { OpptyEditSheet } from './OpptyEdit';
import { OpptyDelete } from './OpptyDelete';
import { IOppty } from '../types/opptyTypes';
import { ValueOf } from 'type-fest';
import { FieldsInDetail, RelationWidgetSideTabs } from 'ui-modules';
import { useOpptyCustomFieldEdit } from '@/oppty/hooks/useOpptyCustomFieldEdit';
import { ActivityList } from '@/activity/components/ActivityList';

export const OPPTY_TABS = {
  GENERAL: 'general',
  PROPERTIES: 'properties',
  ACTIVITIES: 'activities',
};

const STATUS_TYPE_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'destructive' | 'info' | 'secondary'
> = {
  lead: 'secondary',
  qualified: 'info',
  matching: 'default',
  negotiation: 'warning',
  closed_won: 'success',
  closed_lost: 'destructive',
};

type OpptyTabs = ValueOf<typeof OPPTY_TABS>;

export const OpptyDetailSheet = () => {
  const [activeOpptyId, setActiveOpptyId] =
    useQueryState<string>('activeOpptyId');
  const [activeTab, setActiveTab] = useQueryState<OpptyTabs>('oppty_tab', {
    defaultValue: 'general',
  });

  return (
    <FocusSheet
      open={!!activeOpptyId}
      onOpenChange={() => setActiveOpptyId(null)}
    >
      <FocusSheet.View className="bt:sm:w-full sm:max-w-7xl">
        <Sheet.Header>
          <Sheet.Title>Opportunity Detail</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <FocusSheet.Content className="flex flex-auto overflow-hidden">
          <Sidebar collapsible="none" className="flex-none border-r w-64">
            <Sidebar.Group>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {Object.values(OPPTY_TABS).map((tab) => (
                    <Sidebar.MenuItem key={tab}>
                      <Sidebar.MenuButton
                        onClick={() => setActiveTab(tab)}
                        isActive={activeTab === tab}
                      >
                        {tab.charAt(0).toUpperCase() +
                          tab.slice(1).replace('-', ' ')}
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar>

          {(!activeTab || activeTab === 'general') && activeOpptyId && (
            <ScrollArea className="flex-auto h-full">
              <div className="p-4">
                <OpptyDetail opptyId={activeOpptyId} />
              </div>
            </ScrollArea>
          )}
          {activeTab === 'properties' && activeOpptyId && (
            <ScrollArea className="flex-auto h-full">
              <div className="p-4">
                <OpptyProperties opptyId={activeOpptyId} />
              </div>
            </ScrollArea>
          )}
          {activeTab === 'activities' && activeOpptyId && (
            <ScrollArea className="flex-auto h-full">
              <div className="p-4">
                <ActivityList
                  contentId={activeOpptyId}
                  contentType="oppty"
                />
              </div>
            </ScrollArea>
          )}

          <RelationWidgetSideTabs
            contentId={activeOpptyId || ''}
            contentType="block:oppty"
            hookOptions={{ hiddenModules: ['oppty', 'tasks', 'company'] }}
          />
        </FocusSheet.Content>
        <Sheet.Footer className="flex-none">
          <OpptyEditSheet />
          <OpptyDelete
            opptyId={activeOpptyId || ''}
            onClose={() => setActiveOpptyId(null)}
          />
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Close
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </FocusSheet.View>
    </FocusSheet>
  );
};

const formatDate = (value: any): string | undefined => {
  return value ? format(value, 'dd.MM.yyyy') : undefined;
};

const renderTableRow = (
  label: string,
  value: string | number | boolean | undefined | null | React.ReactNode,
  isFirst = false,
  isLast = false,
) => {
  const displayValue =
    value === null || value === undefined || value === ''
      ? '-'
      : typeof value === 'boolean'
      ? value
        ? 'Yes'
        : 'No'
      : typeof value === 'number'
      ? value.toLocaleString()
      : value;

  return (
    <Table.Row>
      <Table.Cell
        className={`bg-sidebar h-auto min-h-10 p-2 bt:whitespace-auto ${
          isFirst ? 'bt:rounded-tl-lg' : ''
        } ${isLast ? 'bt:rounded-bl-lg' : ''}`}
      >
        {label}
      </Table.Cell>
      <Table.Cell
        className={`min-h-10 h-auto p-2 whitespace-normal ${
          isFirst ? 'bt:rounded-tr-lg' : ''
        } ${isLast ? 'bt:rounded-br-lg' : ''}`}
      >
        {displayValue}
      </Table.Cell>
    </Table.Row>
  );
};

const OpptyDetail = ({ opptyId }: { opptyId: string }) => {
  const { oppty, loading } = useGetOppty({
    variables: { _id: opptyId },
  });

  const { statuses } = useBlockStatusesByType({
    projectId: oppty?.projectId || '',
  });

  if (loading) return <Spinner />;
  if (!oppty) return <div>Opportunity not found</div>;

  const statusObj = (statuses || []).find((s) => s._id === oppty.status);

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="Opportunity Information">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              {renderTableRow(
                'Number',
                oppty.number ? `#${oppty.number}` : null,
                true,
              )}
              {renderTableRow('Description', oppty.description)}
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 h-auto min-h-10 bt:whitespace-auto">
                  Status
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  {statusObj ? (
                    <Badge
                      variant={STATUS_TYPE_VARIANT[statusObj.type] || 'default'}
                    >
                      {statusObj.name}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 h-auto min-h-10 bt:whitespace-auto">
                  Customer Source
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10 whitespace-normal">
                  <Badge variant="default" className="blk:capitalize">
                    {oppty.customerSource}
                  </Badge>
                </Table.Cell>
              </Table.Row>
              {renderTableRow('Start Date', formatDate(oppty.startDate))}
              {renderTableRow('Target Date', formatDate(oppty.targetDate))}
              {renderTableRow('Created At', formatDate(oppty.createdAt))}
              {renderTableRow(
                'Updated At',
                formatDate(oppty.updatedAt),
                false,
                true,
              )}
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      <OpptyPropertyCard oppty={oppty} />
    </div>
  );
};

const OpptyPropertyCard = ({ oppty }: { oppty: IOppty }) => {
  const rows = oppty.propertyRows || [];
  const { updateOppty } = useUpdateOppty({ _id: oppty._id });

  if (rows.length === 0) return null;

  const setMainRow = (index: number) => {
    const updated = rows.map((row, i) => ({
      buildingId: row.buildingId,
      zoningId: row.zoningId,
      unitId: row.unitId,
      isMain: i === index,
    }));
    updateOppty({
      variables: {
        _id: oppty._id,
        input: { propertyRows: updated },
      },
    });
  };

  return (
    <InfoCard title="Property">
      <InfoCard.Content className="shadow-none p-0 overflow-hidden">
        <Table>
          <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
            {rows.map((row, index) => (
              <OpptyPropertyRowDetail
                key={`${row.buildingId}-${row.zoningId}-${row.unitId}-${index}`}
                row={row}
                projectId={oppty.projectId}
                isFirst={index === 0}
                isLast={index === rows.length - 1}
                onSetMain={row.unitId && !row.isMain ? () => setMainRow(index) : undefined}
              />
            ))}
          </Table.Body>
        </Table>
      </InfoCard.Content>
    </InfoCard>
  );
};

const OpptyPropertyRowDetail = ({
  row,
  projectId,
  isFirst,
  isLast,
  onSetMain,
}: {
  row: { buildingId?: string; zoningId?: string; unitId?: string; isMain?: boolean };
  projectId?: string;
  isFirst: boolean;
  isLast: boolean;
  onSetMain?: () => void;
}) => {
  const { buildings = [] } = useBuildings({ projectId: projectId || '' });
  const { buildingZonings = [] } = useBuildingZonings({
    buildingId: row.buildingId,
    skip: !row.buildingId,
  });
  const { unit } = useUnit(row.unitId || '');

  const building = buildings.find((b) => b._id === row.buildingId);
  const zoning = buildingZonings.find((z) => z._id === row.zoningId);

  const parts: string[] = [];
  if (building?.name) parts.push(building.name);
  if (zoning) parts.push(`Floor ${zoning.floor}`);
  if (unit) {
    let unitLabel = `Unit ${unit.number}`;
    if (unit.unitType?.name) unitLabel += ` · ${unit.unitType.name}`;
    if (unit.unitType?.price != null)
      unitLabel += ` · ${Number(unit.unitType.price).toLocaleString()}`;
    parts.push(unitLabel);
  }

  const label = row.isMain
    ? 'Main Unit'
    : row.unitId
      ? 'Unit'
      : row.zoningId
        ? 'Zone'
        : 'Building';

  return (
    <Table.Row>
      <Table.Cell
        className={`bg-sidebar h-auto min-h-10 p-2 bt:whitespace-auto ${
          isFirst ? 'bt:rounded-tl-lg' : ''
        } ${isLast ? 'bt:rounded-bl-lg' : ''}`}
      >
        {label}
      </Table.Cell>
      <Table.Cell
        className={`min-h-10 h-auto p-1 px-2 whitespace-normal ${
          isFirst ? 'bt:rounded-tr-lg' : ''
        } ${isLast ? 'bt:rounded-br-lg' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span>{parts.join(' · ') || '-'}</span>
          {onSetMain && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSetMain}
              className="h-6 text-xs px-2"
            >
              Set main
            </Button>
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};

const OpptyProperties = ({ opptyId }: { opptyId: string }) => {
  const { oppty, loading } = useGetOppty({
    variables: { _id: opptyId },
  });

  if (loading) return <Spinner />;
  if (!oppty) return <div>Opportunity not found</div>;

  return (
    <FieldsInDetail
      fieldContentType="block:oppty"
      propertiesData={oppty.propertiesData || {}}
      mutateHook={useOpptyCustomFieldEdit}
      id={oppty._id}
    />
  );
};
