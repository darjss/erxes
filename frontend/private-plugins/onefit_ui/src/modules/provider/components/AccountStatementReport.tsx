import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ColumnDef } from '@tanstack/table-core';
import { Input, RecordTable, RecordTableInlineCell } from 'erxes-ui';
import { ONE_FIT_ACCOUNT_STATEMENT } from '../graphql/accountStatementQueries';
import { SelectProviderSearchable } from './SelectProviderSearchable';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';
import { FilterField } from '~/components/shared/FilterField';

function startOfMonth(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

function endOfMonth(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface AccountStatementRow {
  year: number;
  month: number;
  providerId: string;
  provider?: { _id: string; businessName?: { en?: string; mn?: string } } | null;
  creditsEarnedCompleted: number;
  creditsEarnedNoShow: number;
  bookingCountCompleted: number;
  bookingCountNoShow: number;
}

export function AccountStatementReport() {
  const now = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState(startOfMonth(now));
  const [endDate, setEndDate] = useState(endOfMonth(now));
  const [providerId, setProviderId] = useState<string>('');

  const { data, loading } = useQuery(ONE_FIT_ACCOUNT_STATEMENT, {
    variables: {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      providerId: providerId || undefined,
    },
    skip: !startDate || !endDate,
  });

  const result = data?.oneFitAccountStatement;
  const rows: AccountStatementRow[] = result?.rows ?? [];
  const totalCreditsEarned = result?.totalCreditsEarned ?? 0;

  const columns: ColumnDef<AccountStatementRow>[] = [
    {
      accessorKey: 'year',
      header: 'Year',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {cell.getValue() as number}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'month',
      header: 'Month',
      cell: ({ row }) => {
        const y = row.original.year;
        const m = String(row.original.month).padStart(2, '0');
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {y}-{m}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }) => {
        const provider = row.original.provider;
        const name = provider?.businessName
          ? getLocalizedString(provider.businessName, 'en')
          : row.original.providerId || '-';
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {name}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'creditsEarnedCompleted',
      header: 'Credits (completed)',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {(cell.getValue() as number).toFixed(2)}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'creditsEarnedNoShow',
      header: 'Credits (no-show)',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {(cell.getValue() as number).toFixed(2)}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'bookingCountCompleted',
      header: 'Bookings (completed)',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {cell.getValue() as number}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'bookingCountNoShow',
      header: 'Bookings (no-show)',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {cell.getValue() as number}
        </RecordTableInlineCell>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <FilterField label="Start date">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value || '')}
          />
        </FilterField>
        <FilterField label="End date">
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value || '')}
          />
        </FilterField>
        <FilterField label="Provider" optional>
          <SelectProviderSearchable
            value={providerId}
            onValueChange={(value) => setProviderId(value ?? '')}
            className="min-w-[200px]"
          />
        </FilterField>
      </div>

      <div className="rounded-md border">
        <RecordTable.Provider columns={columns} data={rows} className="m-0">
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              {loading && <RecordTable.RowSkeleton rows={10} />}
              {!loading && <RecordTable.RowList />}
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.Provider>
        {!loading && rows.length > 0 && (
          <div className="border-t bg-muted/30 px-4 py-2 text-sm font-medium">
            Total credits earned: {totalCreditsEarned.toFixed(2)}
          </div>
        )}
      </div>

      {!loading && rows.length === 0 && startDate && endDate && (
        <p className="text-sm text-muted-foreground">
          No completed or no-show bookings in the selected date range.
        </p>
      )}
    </div>
  );
}
