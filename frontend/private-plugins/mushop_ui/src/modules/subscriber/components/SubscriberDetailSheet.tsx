import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  SideMenu,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { CustomersInline, CustomerWidget, CustomerWidgetTrigger } from 'ui-modules';
import { useSubscriberDetail } from '../hooks/useSubscriberDetail';
import { ISubscriber } from '../types';
import { SelectSubscriberStatus } from './SelectSubscriberStatus';

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
    <Table.Cell className="p-2 h-auto min-h-10 whitespace-normal break-all">
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

const SubscriberInfo = ({ subscriber }: { subscriber: ISubscriber }) => {
  const { customerId, plan, status, startDate, endDate, amount, currency, createdAt } =
    subscriber;

  return (
    <CustomersInline.Provider customerIds={[customerId]}>
    <div className="flex flex-1 overflow-hidden">
      <ScrollArea className="flex-1">
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
                      <Badge variant={SelectSubscriberStatus.statusVariant(status)}>
                        {status || '-'}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Row
                    label="Plan"
                    value={plan ? `${plan.name} · ${plan.durationMonths} months · ${plan.price.toLocaleString()} ${plan.currency}` : '-'}
                  />
                  <Row
                    label="Period"
                    value={
                      startDate && endDate
                        ? `${formatDate(startDate)} → ${formatDate(endDate)}`
                        : undefined
                    }
                  />
                  <Row label="Time Left" value={daysRemaining(endDate)} />
                  <Row
                    label="Amount"
                    value={
                      amount != null
                        ? `${amount.toLocaleString()} ${currency || 'MNT'}`
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

      <SideMenu defaultValue="customer">
        <CustomerWidget customerIds={[customerId]} scope="mushop:subscription" />
        <SideMenu.Sidebar>
          <CustomerWidgetTrigger />
        </SideMenu.Sidebar>
      </SideMenu>
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
      <FocusSheet.View className="sm:max-w-4xl">
        <FocusSheet.Header title="Subscription Detail" />
        <FocusSheet.Content className="flex flex-auto overflow-hidden p-0">
          {loading && (
            <div className="flex flex-1 items-center justify-center">
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
