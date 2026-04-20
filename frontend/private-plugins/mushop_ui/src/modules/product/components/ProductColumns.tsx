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
  IconBarcode,
  IconCalendar,
  IconCategory,
  IconCoin,
  IconLabelFilled,
  IconRuler,
  IconShieldCheck,
  IconTag,
  IconUser,
} from '@tabler/icons-react';
import { IMushopProduct } from '../types';
import { ProductStatusAction } from './ProductStatusAction';
import { ProductCategoryAssign } from './ProductCategoryAssign';

const statusVariant = (status?: string) => {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'destructive';
  return 'secondary';
};

export const productColumns: ColumnDef<IMushopProduct>[] = [
  RecordTable.checkboxColumn as ColumnDef<IMushopProduct>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell, row }) => {
      const [, setActiveProductId] =
        useQueryState<string>('activeProductId');
      return (
        <RecordTableInlineCell
          onClick={() => setActiveProductId(row.original._id)}
        >
          <TextOverflowTooltip value={cell.getValue() as string} />
        </RecordTableInlineCell>
      );
    },
    size: 240,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: () => <RecordTable.InlineHead label="Code" icon={IconBarcode} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 140,
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: () => <RecordTable.InlineHead label="Type" icon={IconTag} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 120,
  },
  {
    id: 'unitPrice',
    accessorKey: 'unitPrice',
    header: () => (
      <RecordTable.InlineHead label="Unit Price" icon={IconCoin} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        {cell.getValue() != null
          ? (cell.getValue() as number).toLocaleString()
          : '-'}
      </RecordTableInlineCell>
    ),
    size: 140,
  },
  {
    id: 'uom',
    accessorKey: 'uom',
    header: () => <RecordTable.InlineHead label="UOM" icon={IconRuler} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 100,
  },
  {
    id: 'category',
    header: () => (
      <RecordTable.InlineHead label="Category" icon={IconCategory} />
    ),
    cell: ({ row }) => (
      <ProductCategoryAssign.Provider
        productId={row.original._id}
        categoryId={row.original.categoryId}
        category={row.original.category}
        initialCategory={row.original.initialCategory}
      >
        <ProductCategoryAssign.InlineCell />
      </ProductCategoryAssign.Provider>
    ),
    size: 200,
  },
  {
    id: 'supplier',
    header: () => (
      <RecordTable.InlineHead label="Supplier" icon={IconUser} />
    ),
    cell: ({ row }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={row.original.supplier?.name || '-'} />
      </RecordTableInlineCell>
    ),
    size: 160,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: () => (
      <RecordTable.InlineHead label="Status" icon={IconShieldCheck} />
    ),
    cell: ({ cell, row }) => (
      <RecordTableInlineCell>
        <ProductStatusAction
          productId={row.original._id}
          status={cell.getValue() as string}
        >
          <Badge variant={statusVariant(cell.getValue() as string)}>
            {(cell.getValue() as string) || 'pending'}
          </Badge>
        </ProductStatusAction>
      </RecordTableInlineCell>
    ),
    size: 140,
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
