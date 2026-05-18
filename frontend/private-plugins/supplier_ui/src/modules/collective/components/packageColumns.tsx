import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  RecordTable,
  RecordTableInlineCell,
  useQueryState,
} from 'erxes-ui';
import { ICollectivePackage } from '../hooks/useCollectivePackages';

const statusVariant = (status?: string) => {
  switch (status) {
    case 'active':
      return 'success' as const;
    case 'archived':
      return 'secondary' as const;
    default:
      return 'info' as const;
  }
};

const formatPrice = (value?: number) =>
  value == null
    ? '—'
    : new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
        value,
      );

const formatDate = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
};

export const packageColumns: ColumnDef<ICollectivePackage>[] = [
  RecordTable.checkboxColumn as ColumnDef<ICollectivePackage>,
  {
    id: 'name',
    accessorKey: 'name',
    header: 'name',
    cell: ({ row }) => {
      const [, setActivePackageId] = useQueryState<string>('activePackageId');
      return (
        <RecordTableInlineCell>
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActivePackageId(row.original._id);
            }}
          >
            {row.original.name || 'Unnamed'}
          </Badge>
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'productCount',
    header: 'products',
    cell: ({ row }) => (
      <RecordTableInlineCell className="text-sm">
        {row.original.productIds?.length ?? 0}
      </RecordTableInlineCell>
    ),
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'price',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="text-sm">
        {formatPrice(cell.getValue() as number | undefined)}
      </RecordTableInlineCell>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'status',
    size: 40,
    cell: ({ cell }) => {
      const value = cell.getValue() as string | undefined;
      return (
        <RecordTableInlineCell>
          <Badge variant={statusVariant(value)}>{value || 'draft'}</Badge>
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'created',
    cell: ({ cell }) => (
      <RecordTableInlineCell className="text-sm">
        {formatDate(cell.getValue() as string | undefined)}
      </RecordTableInlineCell>
    ),
  },
];
