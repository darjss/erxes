/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table';
import {
  Avatar,
  Badge,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
  TextOverflowTooltip,
  useQueryState,
} from 'erxes-ui';
import {
  IconBuildingStore,
  IconCalendar,
  IconLabelFilled,
  IconMail,
  IconMapPin,
  IconNumber,
  IconPhone,
  IconShieldCheck,
  IconStar,
} from '@tabler/icons-react';
import { ISupplier } from '../types';
import { SupplierVerificationAction } from './SupplierVerificationAction';

const verificationVariant = (status?: string) => {
  if (status === 'verified') return 'success';
  if (status === 'unverified') return 'destructive';
  return 'secondary';
};

export const suppliersColumns: ColumnDef<ISupplier>[] = [
  RecordTable.checkboxColumn as ColumnDef<ISupplier>,
  {
    id: 'name',
    accessorKey: 'name',
    header: () => (
      <RecordTable.InlineHead label="Name" icon={IconLabelFilled} />
    ),
    cell: ({ cell, row }) => {
      const [, setActiveSupplierId] = useQueryState<string>('activeSupplierId');
      return (
        <RecordTableInlineCell
          onClick={() => setActiveSupplierId(row.original._id)}
        >
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {row.original.logo ? (
                <Avatar.Image src={row.original.logo} />
              ) : (
                <Avatar.Fallback>
                  <IconBuildingStore className="size-3" />
                </Avatar.Fallback>
              )}
            </Avatar>
            <TextOverflowTooltip value={cell.getValue() as string} />
          </div>
        </RecordTableInlineCell>
      );
    },
    size: 240,
  },
  {
    id: 'registrationNumber',
    accessorKey: 'registrationNumber',
    header: () => (
      <RecordTable.InlineHead label="Registration #" icon={IconNumber} />
    ),
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 160,
  },
  {
    id: 'primaryEmail',
    accessorKey: 'primaryEmail',
    header: () => <RecordTable.InlineHead label="Email" icon={IconMail} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 220,
  },
  {
    id: 'primaryPhone',
    accessorKey: 'primaryPhone',
    header: () => <RecordTable.InlineHead label="Phone" icon={IconPhone} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip value={cell.getValue() as string} />
      </RecordTableInlineCell>
    ),
    size: 160,
  },
  {
    id: 'city',
    header: () => <RecordTable.InlineHead label="City" icon={IconMapPin} />,
    cell: ({ row }) => (
      <RecordTableInlineCell>
        <TextOverflowTooltip
          value={row.original.address?.address?.city || ''}
        />
      </RecordTableInlineCell>
    ),
    size: 160,
  },
  {
    id: 'tierLevel',
    accessorKey: 'tierLevel',
    header: () => <RecordTable.InlineHead label="Tier" icon={IconStar} />,
    cell: ({ cell }) => (
      <RecordTableInlineCell>
        {cell.getValue() ? (
          <Badge variant="secondary">{cell.getValue() as string}</Badge>
        ) : null}
      </RecordTableInlineCell>
    ),
    size: 120,
  },
  {
    id: 'verificationStatus',
    accessorKey: 'verificationStatus',
    header: () => (
      <RecordTable.InlineHead label="Verification" icon={IconShieldCheck} />
    ),
    cell: ({ cell, row }) => (
      <RecordTableInlineCell>
        <SupplierVerificationAction
          supplierId={row.original._id}
          status={cell.getValue() as string}
        >
          <Badge variant={verificationVariant(cell.getValue() as string)}>
            {(cell.getValue() as string) || 'pending'}
          </Badge>
        </SupplierVerificationAction>
      </RecordTableInlineCell>
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
