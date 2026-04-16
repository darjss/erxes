/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import {
  IconCalendar,
  IconCalendarOff,
  IconCash,
  IconId,
  IconProgress,
  IconUser,
} from '@tabler/icons-react';
import { ISubscriber } from '../types';
import { SelectSubscriberStatus } from './SelectSubscriberStatus';

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'expired') return 'destructive' as const;
  return 'secondary' as const;
};

export const subscribersColumns: ColumnDef<ISubscriber>[] = [
  RecordTable.checkboxColumn as ColumnDef<ISubscriber>,
  {
    id: 'cpUserId',
    accessorKey: 'cpUserId',
    header: () => <RecordTable.InlineHead label="CP User ID" icon={IconUser} />,
    cell: ({ cell, row }) => {
      const [, setActiveSubscriberId] =
        useQueryState<string>('activeSubscriberId');
      return (
        <RecordTableInlineCell
          onClick={() => setActiveSubscriberId(row.original._id)}
        >
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
    size: 220,
  },
  {
    id: 'erxesCustomerId',
    accessorKey: 'erxesCustomerId',
    header: () => (
      <RecordTable.InlineHead label="Customer ID" icon={IconId} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={(cell.getValue() as string) || '-'} />
      </RecordTableInlineCell>
    ),
    size: 220,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead label="Status" icon={IconProgress} />
    ),
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
    id: 'startDate',
    accessorKey: 'startDate',
    header: () => (
      <RecordTable.InlineHead label="Start Date" icon={IconCalendar} />
    ),
    cell: ({ cell }) => (
      <RelativeDateDisplay value={cell.getValue() as string} asChild>
        <RecordTableInlineCell>
          <RelativeDateDisplay.Value value={cell.getValue() as string} />
        </RecordTableInlineCell>
      </RelativeDateDisplay>
    ),
    size: 160,
  },
  {
    id: 'endDate',
    accessorKey: 'endDate',
    header: () => (
      <RecordTable.InlineHead label="End Date" icon={IconCalendarOff} />
    ),
    cell: ({ cell }) => (
      <RelativeDateDisplay value={cell.getValue() as string} asChild>
        <RecordTableInlineCell>
          <RelativeDateDisplay.Value value={cell.getValue() as string} />
        </RecordTableInlineCell>
      </RelativeDateDisplay>
    ),
    size: 160,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => (
      <RecordTable.InlineHead label="Created" icon={IconCalendar} />
    ),
    cell: ({ cell }) => (
      <RelativeDateDisplay value={cell.getValue() as string} asChild>
        <RecordTableInlineCell>
          <RelativeDateDisplay.Value value={cell.getValue() as string} />
        </RecordTableInlineCell>
      </RelativeDateDisplay>
    ),
    size: 160,
  },
];
