import { ColumnDef } from '@tanstack/table-core';
import { Badge, RecordTableInlineCell } from 'erxes-ui';
import { format } from 'date-fns';
import { IBlockAgencyUnit } from '../types/unit';
import { SelectMember } from './SelectMember';

export const unitColumns: ColumnDef<IBlockAgencyUnit>[] = [
  {
    id: 'blockUnitId',
    accessorKey: 'blockUnitId',
    header: 'unit',
    cell: ({ row }) => {
      const num = row.original.unitNumber;
      const id = row.original.blockUnitId;
      return (
        <RecordTableInlineCell>
          <span className="font-medium">{num || id}</span>
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'blockDeveloperName',
    accessorKey: 'blockDeveloperName',
    header: 'developer',
    size: 120,
    cell: ({ row }) => {
      const name = row.original.blockDeveloperName;
      if (!name) return null;
      return (
        <RecordTableInlineCell>
          <Badge variant="secondary">{name}</Badge>
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'agency',
    accessorKey: 'agency',
    header: 'agency',
    size: 120,
    cell: ({ row }) => {
      const name = row.original.agency?.name;
      if (!name) return null;
      return (
        <RecordTableInlineCell>
          <Badge variant="ghost">{name}</Badge>
        </RecordTableInlineCell>
      );
    },
  },
  {
    id: 'memberId',
    accessorKey: 'memberId',
    header: 'member',
    size: 160,
    cell: ({ row }) => (
      <RecordTableInlineCell>
        <SelectMember unitId={row.original._id} memberId={row.original.memberId} />
      </RecordTableInlineCell>
    ),
  },
  {
    id: 'assignedAt',
    accessorKey: 'assignedAt',
    header: 'assigned at',
    size: 60,
    cell: ({ cell }) => {
      const val = cell.getValue() as string | undefined;
      if (!val) return null;
      return (
        <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
          {format(new Date(val), 'yyyy-MM-dd')}
        </RecordTableInlineCell>
      );
    },
  },
];
