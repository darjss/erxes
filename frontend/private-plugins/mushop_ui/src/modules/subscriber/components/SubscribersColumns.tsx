/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  RecordTable,
  RecordTableInlineCell,
  useQueryState,
} from 'erxes-ui';
import {
  IconCalendar,
  IconCash,
  IconClockHour4,
  IconProgress,
  IconUser,
  IconPackage,
} from '@tabler/icons-react';
import { CustomersInline } from 'ui-modules';
import { ISubscriber } from '../types';
import { SelectSubscriberStatus } from './SelectSubscriberStatus';

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'expired') return 'destructive' as const;
  return 'secondary' as const;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '?';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const subscribersColumns: ColumnDef<ISubscriber>[] = [
  RecordTable.checkboxColumn as ColumnDef<ISubscriber>,
  {
    id: 'customerId',
    accessorKey: 'customerId',
    header: () => <RecordTable.InlineHead label="Customer" icon={IconUser} />,
    cell: ({ cell, row }) => {
      const [, setActiveSubscriberId] =
        useQueryState<string>('activeSubscriberId');
      const customerId = cell.getValue() as string;
      const { customer } = row.original;
      return (
        <RecordTableInlineCell
          onClick={() => setActiveSubscriberId(row.original._id)}
        >
          <CustomersInline
            customerIds={[customerId]}
            customers={customer ? [customer] : undefined}
            placeholder="—"
          />
        </RecordTableInlineCell>
      );
    },
    size: 220,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => <RecordTable.InlineHead label="Status" icon={IconProgress} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <Badge variant={statusVariant(cell.getValue() as string)}>
          {(cell.getValue() as string) || '-'}
        </Badge>
      </RecordTableInlineCell>
    ),
    size: 120,
  },
  {
    id: 'plan',
    header: () => <RecordTable.InlineHead label="Plan" icon={IconPackage} />,
    cell: ({ row }) => {
      const plan = row.original.plan;
      return (
        <RecordTableInlineCell>
          {plan ? `${plan.name} · ${plan.durationMonths}mo` : '-'}
        </RecordTableInlineCell>
      );
    },
    size: 160,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: () => <RecordTable.InlineHead label="Amount" icon={IconCash} />,
    cell: ({ cell, row }) => {
      const amount = cell.getValue() as number;
      const currency = row.original.currency || 'MNT';
      return (
        <RecordTableInlineCell>
          {amount != null ? `${amount.toLocaleString()} ${currency}` : '-'}
        </RecordTableInlineCell>
      );
    },
    size: 140,
  },
  {
    id: 'timeLeft',
    header: () => (
      <RecordTable.InlineHead label="Time Left" icon={IconClockHour4} />
    ),
    cell: ({ row }) => {
      const { endDate, status } = row.original;
      if (!endDate || status !== 'active') {
        return <RecordTableInlineCell>-</RecordTableInlineCell>;
      }
      const diff = Math.ceil(
        (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      const label =
        diff <= 0 ? 'Expires today' : `${diff} day${diff === 1 ? '' : 's'}`;
      return <RecordTableInlineCell>{label}</RecordTableInlineCell>;
    },
    size: 120,
  },
  {
    id: 'duration',
    header: () => (
      <RecordTable.InlineHead label="Subscription Period" icon={IconCalendar} />
    ),
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <RecordTableInlineCell>
          {startDate && endDate
            ? `${formatDate(startDate)} → ${formatDate(endDate)}`
            : '-'}
        </RecordTableInlineCell>
      );
    },
    size: 260,
  },
  {
    id: 'subscribedAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead label="Subscribed At" icon={IconCalendar} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        {formatDate(cell.getValue() as string)}
      </RecordTableInlineCell>
    ),
    size: 140,
  },
];
