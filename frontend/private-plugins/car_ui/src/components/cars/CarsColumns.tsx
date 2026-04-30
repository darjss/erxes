import type { ComponentType } from 'react';
import {
  IconArrowsSort,
  IconBarcode,
  IconCalendar,
  IconHash,
  IconNotes,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Button,
  RecordTable,
  RecordTableInlineCell,
  TextOverflowTooltip,
} from 'erxes-ui';
import { Link } from 'react-router-dom';

import { ICar } from '~/types/car';

type Translate = (key: string, options: { defaultValue: string }) => string;

const SortableHead = ({
  label,
  icon: Icon,
  isActive,
  sortDirection,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
  sortDirection?: number | null;
  onClick: () => void;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-auto px-0 text-xs font-mono uppercase tracking-wide text-accent-foreground hover:bg-transparent hover:text-primary"
      onClick={onClick}
    >
      <Icon className="size-3.5" />
      {label}
      <IconArrowsSort
        className={`size-3.5 transition ${
          isActive
            ? 'text-primary opacity-100'
            : 'text-muted-foreground opacity-60'
        } ${isActive && sortDirection === -1 ? 'rotate-180' : ''}`}
      />
    </Button>
  );
};

export const createCarsColumns = ({
  sortField,
  sortDirection,
  onSort,
  t,
}: {
  sortField: string | null;
  sortDirection: number | null;
  onSort: (field: string) => void;
  t: Translate;
}): ColumnDef<ICar>[] => [
  RecordTable.checkboxColumn as ColumnDef<ICar>,
  {
    id: 'plateNumber',
    accessorKey: 'plateNumber',
    header: () => (
      <SortableHead
        label={t('Plate Number', { defaultValue: 'Plate Number' })}
        icon={IconHash}
        isActive={sortField === 'plateNumber'}
        sortDirection={sortDirection}
        onClick={() => onSort('plateNumber')}
      />
    ),
    cell: ({ row, cell }) => (
      <RecordTableInlineCell>
        <Button
          variant="ghost"
          className="h-auto max-w-full justify-start px-0 text-left"
          asChild
        >
          <Link to={`/car/${row.original._id}`}>
            <TextOverflowTooltip value={(cell.getValue() as string) || '—'} />
          </Link>
        </Button>
      </RecordTableInlineCell>
    ),
    size: 180,
  },
  {
    id: 'vinNumber',
    accessorKey: 'vinNumber',
    header: () => (
      <SortableHead
        label={t('VIN', { defaultValue: 'VIN' })}
        icon={IconBarcode}
        isActive={sortField === 'vinNumber'}
        sortDirection={sortDirection}
        onClick={() => onSort('vinNumber')}
      />
    ),
    cell: ({ row, cell }) => (
      <RecordTableInlineCell>
        <Button
          variant="ghost"
          className="h-auto max-w-full justify-start px-0 text-left"
          asChild
        >
          <Link to={`/car/${row.original._id}`}>
            <TextOverflowTooltip value={(cell.getValue() as string) || '—'} />
          </Link>
        </Button>
      </RecordTableInlineCell>
    ),
    size: 220,
  },
  {
    id: 'vintageYear',
    accessorKey: 'vintageYear',
    header: () => (
      <SortableHead
        label={t('Vintage Year', { defaultValue: 'Vintage Year' })}
        icon={IconCalendar}
        isActive={sortField === 'vintageYear'}
        sortDirection={sortDirection}
        onClick={() => onSort('vintageYear')}
      />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        {(cell.getValue() as number) || '—'}
      </RecordTableInlineCell>
    ),
    size: 140,
  },
  {
    id: 'importYear',
    accessorKey: 'importYear',
    header: () => (
      <SortableHead
        label={t('Import Year', { defaultValue: 'Import Year' })}
        icon={IconCalendar}
        isActive={sortField === 'importYear'}
        sortDirection={sortDirection}
        onClick={() => onSort('importYear')}
      />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        {(cell.getValue() as number) || '—'}
      </RecordTableInlineCell>
    ),
    size: 140,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => (
      <SortableHead
        label={t('Description', { defaultValue: 'Description' })}
        icon={IconNotes}
        isActive={sortField === 'description'}
        sortDirection={sortDirection}
        onClick={() => onSort('description')}
      />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={(cell.getValue() as string) || '—'} />
      </RecordTableInlineCell>
    ),
    size: 320,
  },
];
