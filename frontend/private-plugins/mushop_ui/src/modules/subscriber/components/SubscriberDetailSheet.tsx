import {
  Badge,
  Button,
  Calendar,
  FocusSheet,
  InfoCard,
  Popover,
  ScrollArea,
  Sheet,
  Sidebar,
  Spinner,
  Table,
  Tabs,
  useConfirm,
  useQueryState,
} from 'erxes-ui';
import { useState } from 'react';
import {
  ActivityLogs,
  CustomersInline,
  RelationWidgetSideTabs,
  usePermissionCheck,
} from 'ui-modules';
import { useSubscriberDetail } from '../hooks/useSubscriberDetail';
import { useUpdateSubscriptionEndDate } from '../hooks/useUpdateSubscriptionEndDate';
import { ISubscriber } from '../types';
import { SelectSubscriberStatus } from './SelectSubscriberStatus';
import { subscriptionCustomActivities } from './SubscriptionActivityRows';

const Row = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | React.ReactNode;
}) => (
  <Table.Row>
    <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
      {label}
    </Table.Cell>
    <Table.Cell className="p-2 h-auto min-h-10 break-all whitespace-normal">
      {value ?? '-'}
    </Table.Cell>
  </Table.Row>
);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const daysRemaining = (endDate?: string) => {
  if (!endDate) return null;
  const diff = Math.ceil(
    (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Expires today';
  return `${diff} days remaining`;
};

const SubscriberSidebar = () => {
  const [selectedTab, setSelectedTab] = useQueryState<string>('tab');

  return (
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupContent className="mt-2">
          <Sidebar.Menu>
            {['overview', 'activity'].map((tab) => (
              <Sidebar.MenuItem key={tab}>
                <Sidebar.MenuButton
                  isActive={
                    selectedTab === tab || (tab === 'overview' && !selectedTab)
                  }
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  );
};

const EndDateEditor = ({
  _id,
  startDate,
  endDate,
}: {
  _id: string;
  startDate?: string;
  endDate?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { updateEndDate, loading } = useUpdateSubscriptionEndDate();
  const { hasActionPermission } = usePermissionCheck();
  const { confirm } = useConfirm();

  const canEdit = hasActionPermission('mushopUpdateSubscriptionEndDate');

  const currentEnd = endDate ? new Date(endDate) : undefined;

  let minDate: Date | undefined;
  let startMonth: Date | undefined;

  if (startDate) {
    minDate = new Date(startDate);
    minDate.setDate(minDate.getDate() + 1);

    const s = new Date(startDate);
    startMonth = new Date(s.getFullYear(), s.getMonth(), 1);
  }

  const handleSelect = (date?: Date) => {
    if (!date) return;

    if (currentEnd && date.toDateString() === currentEnd.toDateString()) {
      setOpen(false);
      return;
    }

    setOpen(false);

    const oldLabel = formatDate(endDate);
    const newLabel = formatDate(date.toISOString());

    confirm({
      message: `Change subscription end date?`,
      options: {
        description: `This subscription will end on ${newLabel} instead of ${oldLabel}. The customer's access period will change accordingly.`,
        confirmationValue: "update",
        okLabel: 'Update',
      },
    }).then(() => {
      updateEndDate(_id, date);
    });
  };

  if (!canEdit) {
    return (
      <span className="inline-flex items-center gap-1">
        <span>{startDate ? formatDate(startDate) : '-'}</span>
        <span className="text-muted-foreground">→</span>
        <span>{formatDate(endDate)}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span>{startDate ? formatDate(startDate) : '-'}</span>
      <span className="text-muted-foreground">→</span>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={loading}
            className="inline-flex items-center gap-1 hover:bg-accent disabled:opacity-50 -mx-1 px-1 rounded hover:text-accent-foreground cursor-pointer"
          >
            {formatDate(endDate)}
          </button>
        </Popover.Trigger>
        <Popover.Content className="p-0 w-auto" align="end">
          <Calendar
            mode="single"
            selected={currentEnd}
            defaultMonth={currentEnd}
            startMonth={startMonth}
            onSelect={handleSelect}
            disabled={minDate ? { before: minDate } : undefined}
          />
        </Popover.Content>
      </Popover>
    </span>
  );
};

const SubscriberInfo = ({ subscriber }: { subscriber: ISubscriber }) => {
  const {
    _id,
    customerId,
    plan,
    status,
    startDate,
    endDate,
    amount,
    currency,
    createdAt,
  } = subscriber;

  const [selectedTab] = useQueryState<string>('tab');

  return (
    <CustomersInline.Provider customerIds={[customerId]}>
      <FocusSheet.SideBar>
        <SubscriberSidebar />
      </FocusSheet.SideBar>

      <div className="flex flex-1 overflow-hidden">
        <Tabs
          value={selectedTab ?? 'overview'}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <Tabs.Content
            value="overview"
            className="flex-1 mt-0 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="p-4">
                <InfoCard title="Subscription">
                  <InfoCard.Content className="shadow-none p-0 overflow-hidden">
                    <Table>
                      <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
                        <Row
                          label="Customer"
                          value={
                            <span className="inline-flex items-center gap-2">
                              <CustomersInline.Avatar />
                              <CustomersInline.Title />
                            </span>
                          }
                        />
                        <Table.Row>
                          <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
                            Status
                          </Table.Cell>
                          <Table.Cell className="p-1 px-2 h-auto min-h-10">
                            <Badge
                              variant={SelectSubscriberStatus.statusVariant(
                                status,
                              )}
                            >
                              {status || '-'}
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                        <Row
                          label="Plan"
                          value={
                            plan
                              ? `${plan.name} · ${
                                  plan.durationMonths
                                } months · ${plan.price.toLocaleString()} ${
                                  plan.currency
                                }`
                              : '-'
                          }
                        />
                        <Row
                          label="Period"
                          value={
                            <EndDateEditor
                              _id={_id}
                              startDate={startDate}
                              endDate={endDate}
                            />
                          }
                        />
                        <Row label="Time Left" value={daysRemaining(endDate)} />
                        <Row
                          label="Amount"
                          value={
                            amount != null
                              ? `${amount.toLocaleString()} ${
                                  currency || 'MNT'
                                }`
                              : undefined
                          }
                        />
                        <Row label="Created" value={formatDate(createdAt)} />
                      </Table.Body>
                    </Table>
                  </InfoCard.Content>
                </InfoCard>
              </div>
            </ScrollArea>
          </Tabs.Content>

          <Tabs.Content
            value="activity"
            className="flex-1 mt-0 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="pt-3">
                <ActivityLogs
                  targetId={_id}
                  customActivities={subscriptionCustomActivities}
                  variant="backward"
                  emptyMessage="No activity yet"
                />
              </div>
            </ScrollArea>
          </Tabs.Content>
        </Tabs>

        <RelationWidgetSideTabs
          contentId={_id}
          contentType="mushop:subscription"
          access={{ customer: 'read' }}
        />
      </div>
    </CustomersInline.Provider>
  );
};

export const SubscriberDetailSheet = () => {
  const [activeSubscriberId, setActiveSubscriberId] =
    useQueryState<string>('activeSubscriberId');
  const { subscriber, loading } = useSubscriberDetail(activeSubscriberId);

  return (
    <FocusSheet
      open={!!activeSubscriberId}
      onOpenChange={() => setActiveSubscriberId(null)}
    >
      <FocusSheet.View className="sm:max-w-5xl">
        <FocusSheet.Header title="Subscription Detail" />
        <FocusSheet.Content className="flex flex-auto p-0 overflow-hidden">
          {loading && (
            <div className="flex flex-1 justify-center items-center">
              <Spinner />
            </div>
          )}
          {!loading && subscriber && <SubscriberInfo subscriber={subscriber} />}
          {!loading && !subscriber && (
            <div className="p-4">Subscription not found</div>
          )}
        </FocusSheet.Content>
        <Sheet.Footer className="flex-none">
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
