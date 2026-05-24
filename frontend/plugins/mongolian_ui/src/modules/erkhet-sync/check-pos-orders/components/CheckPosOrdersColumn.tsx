import {
  IconCurrencyDollar,
  IconHash,
  IconLabel,
  IconClock,
  IconCalendarPlus,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  RecordTable,
  TextOverflowTooltip,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useTranslation } from 'react-i18next';

import { ICheckPosOrders } from '../types/checkPosOrders';
import { CheckPosOrdersMoreColumn } from './CheckPosOrdersMoreColumn';

export const checkPosOrdersColumns: ColumnDef<ICheckPosOrders>[] = [
  CheckPosOrdersMoreColumn,
  RecordTable.checkboxColumn as ColumnDef<ICheckPosOrders>,
  {
    id: 'number',
    accessorKey: 'number',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconLabel} label={t('number')} />;
    },
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
    size: 250,
  },
  {
    id: 'totalAmount',
    accessorKey: 'totalAmount',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconHash} label={t('total-amount')} />;
    },
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead label={t('created-at')} icon={IconCalendarPlus} />;
    },
    cell: ({ cell }) => {
      return (
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableInlineCell>
        </RelativeDateDisplay>
      );
    },
  },
  {
    id: 'paidDate',
    accessorKey: 'paidDate',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconCurrencyDollar} label={t('paid-at')} />;
    },
    cell: ({ cell }) => {
      return (
        <RelativeDateDisplay value={cell.getValue() as string} asChild>
          <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
            <RelativeDateDisplay.Value value={cell.getValue() as string} />
          </RecordTableInlineCell>
        </RelativeDateDisplay>
      );
    },
  },
  {
    id: 'unSynced',
    accessorKey: 'unSynced',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconClock} label={t('un-synced')} />;
    },
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'syncedDate',
    accessorKey: 'syncedDate',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconClock} label={t('synced-date')} />;
    },
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'syncedBillNumber',
    accessorKey: 'syncedBillNumber',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconClock} label={t('synced-bill')} />;
    },
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'syncedCustomer',
    accessorKey: 'syncedCustomer',
    header: () => {
      const { t } = useTranslation('mongolian');
      return <RecordTable.InlineHead icon={IconClock} label={t('synced-customer')} />;
    },
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell>
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
  },
];
