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
  IconAlertTriangle,
  IconCalendar,
  IconPackage,
  IconShield,
} from '@tabler/icons-react';
import { IInventoryItem } from '../types';
import { ProductsInline } from 'ui-modules';

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success' as const;
  if (status === 'out_of_stock') return 'destructive' as const;
  return 'secondary' as const;
};

export const inventoryColumns: ColumnDef<IInventoryItem>[] = [
  RecordTable.checkboxColumn as ColumnDef<IInventoryItem>,
  {
    id: 'product',
    accessorKey: 'productId',
    header: () => (
      <RecordTable.InlineHead label="Product" icon={IconPackage} />
    ),
    cell: ({ cell, row }) => {
      const [, setActiveInventoryId] = useQueryState<string>('activeInventoryId');
      return (
        <RecordTableInlineCell onClick={() => setActiveInventoryId(row.original._id)}>
          <div className="flex items-center gap-2">
            <ProductsInline
              productIds={[cell.getValue() as string]}
              placeholder="Unknown product"
            />
            {row.original.isBelowSafeRemainder && (
              <IconAlertTriangle className="size-3.5 text-destructive shrink-0" />
            )}
          </div>
        </RecordTableInlineCell>
      );
    },
    size: 240,
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: () => (
      <RecordTable.InlineHead label="Quantity" icon={IconPackage} />
    ),
    cell: ({ cell, row }) => (
      <RecordTableInlineCell>
        <span
          className={
            row.original.isBelowSafeRemainder
              ? 'text-destructive font-medium'
              : ''
          }
        >
          {cell.getValue() as number}
        </span>
      </RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    id: 'safeRemainder',
    accessorKey: 'safeRemainder',
    header: () => (
      <RecordTable.InlineHead label="Safe min" icon={IconShield} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        {cell.getValue() != null ? (cell.getValue() as number) : '-'}
      </RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    id: 'barcode',
    accessorKey: 'barcode',
    header: () => (
      <RecordTable.InlineHead label="Barcode" icon={IconPackage} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={(cell.getValue() as string) || '-'} />
      </RecordTableInlineCell>
    ),
    size: 140,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead label="Status" icon={IconPackage} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <Badge variant={statusVariant(cell.getValue() as string)}>
          {(cell.getValue() as string) || 'active'}
        </Badge>
      </RecordTableInlineCell>
    ),
    size: 120,
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
    size: 140,
  },
];
