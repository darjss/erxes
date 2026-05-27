/* eslint-disable react-hooks/rules-of-hooks */
import { contractDetailSheetState } from '@/contract/states/contractDetailSheetState';
import { IContract, ContractPartyType } from '@/contract/types/contractTypes';
import { IBlockContractStatus } from '@/contract-status/types';
import {
  IconHash,
  IconProgressCheck,
  IconUser,
  IconCoin,
  IconCalendar,
  IconCalendarEvent,
  IconCalendarCheck,
  IconUserCircle,
} from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  CurrencyDisplay,
  RecordTable,
  RecordTableInlineCell,
} from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { format } from 'date-fns';
import { CustomersInline, CompaniesInline, MembersInline } from 'ui-modules';

const parseDate = (value: any) => {
  if (!value) return null;
  const num = Number(value);
  const d = new Date(isNaN(num) ? value : num);
  return isNaN(d.getTime()) ? null : d;
};

export const contractsColumns = (
  statuses: IBlockContractStatus[],
): ColumnDef<IContract>[] => {
  const checkBoxColumn = RecordTable.checkboxColumn as ColumnDef<IContract>;

  return [
    checkBoxColumn,
    {
      id: 'number',
      accessorKey: 'number',
      header: () => <RecordTable.InlineHead label="Number" icon={IconHash} />,
      cell: ({ cell }) => {
        const number = cell.getValue() as string;
        const setActiveContract = useSetAtom(contractDetailSheetState);

        return (
          <RecordTableInlineCell.Anchor
            onClick={() => setActiveContract(cell.row.original._id)}
          >
            #{number || cell.row.original._id}
          </RecordTableInlineCell.Anchor>
        );
      },
      size: 160,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: () => (
        <RecordTable.InlineHead label="Status" icon={IconProgressCheck} />
      ),
      cell: ({ cell }) => {
        const statusId = cell.getValue() as string;
        const status = statuses.find((s) => s._id === statusId);
        if (!status) return null;
        return (
          <Badge
            variant="secondary"
            style={{
              backgroundColor: status.color ? `${status.color}20` : undefined,
              color: status.color || undefined,
            }}
          >
            {status.name}
          </Badge>
        );
      },
      size: 170,
    },
    {
      id: 'party',
      accessorKey: 'party',
      header: () => <RecordTable.InlineHead label="Party" icon={IconUser} />,
      cell: ({ cell }) => {
        const party = cell.getValue() as IContract['party'];
        if (!party) return <span className="text-muted-foreground">-</span>;
        if (party.type === ContractPartyType.CUSTOMER) {
          return (
            <CustomersInline.Provider customerIds={[party.id]}>
              <span className="inline-flex items-center gap-2 overflow-hidden">
                <CustomersInline.Avatar />
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-semibold truncate text-foreground">
                    <CustomersInline.Title />
                  </div>
                </div>
              </span>
            </CustomersInline.Provider>
          );
        }
        return (
          <CompaniesInline.Provider companyIds={[party.id]}>
            <span className="inline-flex items-center gap-2 overflow-hidden">
              <CompaniesInline.Avatar />
              <div className="min-w-0 space-y-1">
                <div className="text-sm font-semibold truncate text-foreground">
                  <CompaniesInline.Title />
                </div>
              </div>
            </span>
          </CompaniesInline.Provider>
        );
      },
      size: 240,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: () => <RecordTable.InlineHead label="Amount" icon={IconCoin} />,
      cell: ({ cell }) => {
        const amount = cell.getValue() as number;
        const currency = cell.row.original.currency;
        if (!amount) return <span className="text-muted-foreground">-</span>;
        return (
          <span className="flex items-center gap-1">
            {currency && <CurrencyDisplay variant="icon" code={currency} />}
            {amount.toLocaleString()}
          </span>
        );
      },
      size: 170,
    },
    {
      id: 'date',
      accessorKey: 'date',
      header: () => <RecordTable.InlineHead label="Date" icon={IconCalendar} />,
      cell: ({ cell }) => {
        const d = parseDate(cell.getValue());
        if (!d) return <span className="text-muted-foreground">-</span>;
        return <span>{format(d, 'MMM dd, yyyy')}</span>;
      },
      size: 170,
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: () => (
        <RecordTable.InlineHead label="Start Date" icon={IconCalendarEvent} />
      ),
      cell: ({ cell }) => {
        const d = parseDate(cell.getValue());
        if (!d) return <span className="text-muted-foreground">-</span>;
        return <span>{format(d, 'MMM dd, yyyy')}</span>;
      },
      size: 170,
    },
    {
      id: 'endDate',
      accessorKey: 'endDate',
      header: () => (
        <RecordTable.InlineHead label="End Date" icon={IconCalendarCheck} />
      ),
      cell: ({ cell }) => {
        const isLifeTime = cell.row.original.isLifeTime;
        if (isLifeTime) {
          return <Badge variant="secondary">Lifetime</Badge>;
        }
        const d = parseDate(cell.getValue());
        if (!d) return <span className="text-muted-foreground">-</span>;
        return <span>{format(d, 'MMM dd, yyyy')}</span>;
      },
      size: 170,
    },
    {
      id: 'user',
      accessorKey: 'user',
      header: () => (
        <RecordTable.InlineHead label="User" icon={IconUserCircle} />
      ),
      cell: ({ cell }) => {
        const userId = cell.getValue() as string;
        if (!userId) return <span className="text-muted-foreground">-</span>;
        return (
          <MembersInline.Provider memberIds={[userId]}>
            <MembersInline.Avatar />
          </MembersInline.Provider>
        );
      },
      size: 180,
    },
  ];
};
