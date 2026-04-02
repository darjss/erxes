import { ColumnDef } from '@tanstack/table-core';
import { IListingInline } from '../types/listing';
import {
  Badge,
  CurrencyDisplay,
  formatAmount,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { format } from 'date-fns';

export const listingColumns: ColumnDef<IListingInline>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'title',
  },
  {
    id: 'propertyType',
    accessorKey: 'propertyType',
    header: 'property type',
    size: 80,
  },
  {
    id: 'pricing',
    accessorKey: 'pricing',
    header: 'price amount',
    cell: ({ cell }) => {
      const { amount, currency } = cell.row.original.pricing || {};
      return (
        <RecordTableInlineCell className="flex items-center justify-center">
          <CurrencyDisplay className="shrink" variant="code" code={currency} />
          <span className="grow">
            {formatAmount(amount as number, 'finance')}
          </span>
        </RecordTableInlineCell>
      );
    },
    size: 70,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'status',
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell className="flex items-center justify-center">
          <Badge
            variant={
              cell.getValue() === 'active'
                ? 'success'
                : cell.getValue() === 'inactive'
                ? 'warning'
                : cell.getValue() === 'sold'
                ? 'info'
                : 'secondary'
            }
          >
            {cell.row.original.status}
          </Badge>
        </RecordTableInlineCell>
      );
    },
    size: 30,
  },
  {
    id: 'viewCount',
    accessorKey: 'viewCount',
    header: 'views',
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell className="flex items-center justify-center">
          {cell.row.original.viewCount || 0}
        </RecordTableInlineCell>
      );
    },
    size: 30,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'created at',
    cell: ({ cell }) => {
      return (
        <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
          {format(Number(cell.getValue()), 'yyyy-MM-dd HH:mm')}
        </RecordTableInlineCell>
      );
    },
    size: 40,
  },
];
