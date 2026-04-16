import {
  Badge,
  Button,
  FocusSheet,
  InfoCard,
  ScrollArea,
  Sheet,
  Spinner,
  Table,
  useQueryState,
} from 'erxes-ui';
import { useSubscriberDetail } from '../hooks/useSubscriberDetail';
import { useCancelSubscription } from '../hooks/useCancelSubscription';
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

const SubscriberInfo = ({ subscriber }: { subscriber: ISubscriber }) => {
  const { handleCancel, loading: cancelling } = useCancelSubscription();

  const {
    _id,
    cpUserId,
    erxesCustomerId,
    status,
    startDate,
    endDate,
    amount,
    currency,
    invoiceId,
    createdAt,
  } = subscriber;

  return (
    <div className="flex flex-col gap-4">
      <InfoCard title="Subscription">
        <InfoCard.Content className="shadow-none p-0 overflow-hidden">
          <Table>
            <Table.Body className="bt:[&_td]:px-2 bt:[&_tr:first-child_td]:border-t bt:[&_td]:h-10">
              <Row label="CP User ID" value={cpUserId} />
              <Row label="Customer ID" value={erxesCustomerId} />
              <Table.Row>
                <Table.Cell className="bg-sidebar p-2 w-44 h-auto min-h-10 text-muted-foreground">
                  Status
                </Table.Cell>
                <Table.Cell className="p-1 px-2 h-auto min-h-10">
                  <Badge
                    variant={SelectSubscriberStatus.statusVariant(status)}
                  >
                    {status || '-'}
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Row label="Start Date" value={formatDate(startDate)} />
              <Row label="End Date" value={formatDate(endDate)} />
              <Row
                label="Amount"
                value={
                  amount != null
                    ? `${amount.toLocaleString()} ${currency || 'MNT'}`
                    : undefined
                }
              />
              <Row label="Invoice ID" value={invoiceId} />
              <Row label="Created" value={formatDate(createdAt)} />
            </Table.Body>
          </Table>
        </InfoCard.Content>
      </InfoCard>

      {status === 'active' && (
        <Button
          variant="destructive"
          size="sm"
          disabled={cancelling}
          onClick={() => handleCancel(_id)}
        >
          {cancelling ? 'Cancelling…' : 'Cancel Subscription'}
        </Button>
      )}
    </div>
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
      <FocusSheet.View className="sm:max-w-2xl">
        <FocusSheet.Header title="Subscription Detail" />
        <FocusSheet.Content className="flex flex-auto overflow-hidden">
          <ScrollArea className="flex-auto h-full">
            <div className="p-4">
              {loading && <Spinner />}
              {!loading && subscriber && (
                <SubscriberInfo subscriber={subscriber} />
              )}
              {!loading && !subscriber && <div>Subscription not found</div>}
            </div>
          </ScrollArea>
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
