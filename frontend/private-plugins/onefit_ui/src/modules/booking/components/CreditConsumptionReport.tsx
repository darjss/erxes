import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ColumnDef } from '@tanstack/table-core';
import { Input, RecordTable, RecordTableInlineCell } from 'erxes-ui';
import { ONE_FIT_CREDIT_CONSUMPTION } from '~/modules/booking/graphql/bookingQueries';
import { CreditConsumptionRow } from '~/modules/booking/types/booking';
import { FilterField } from '~/components/shared/FilterField';
import { SelectCompany } from '~/modules/credit/components/SelectCompany';

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

export function CreditConsumptionReport() {
  const now = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState(startOfMonth(now));
  const [endDate, setEndDate] = useState(endOfMonth(now));
  const [companyId, setCompanyId] = useState<string>('');

  const { data, loading } = useQuery(ONE_FIT_CREDIT_CONSUMPTION, {
    variables: {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      companyId: companyId || undefined,
    },
    skip: !startDate || !endDate,
  });

  const result = data?.oneFitCreditConsumption;
  const rows: CreditConsumptionRow[] = result?.rows ?? [];
  const totalCreditsConsumed = result?.totalCreditsConsumed ?? 0;
  const totalBookings = result?.totalBookings ?? 0;

  const columns: ColumnDef<CreditConsumptionRow>[] = [
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
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => {
        const user = row.original.user;
        const fullName =
          user && (user.firstName || user.lastName)
            ? [user.firstName, user.lastName].filter(Boolean).join(' ')
            : undefined;
        const label = fullName || user?.primaryEmail || user?.primaryPhone;
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {label || row.original.userId}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'totalCreditsConsumed',
      header: 'Credits consumed',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {(cell.getValue() as number).toFixed(2)}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'bookingCount',
      header: 'Bookings',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-medium">
          {cell.getValue() as number}
        </RecordTableInlineCell>
      ),
    },
    {
      id: 'averageCreditsPerBooking',
      header: 'Avg credits / booking',
      cell: ({ row }) => {
        const { totalCreditsConsumed: credits, bookingCount } = row.original;
        const avg = bookingCount > 0 ? credits / bookingCount : 0;
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {avg.toFixed(2)}
          </RecordTableInlineCell>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <FilterField label="Start date">
          <Input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value || '')}
          />
        </FilterField>
        <FilterField label="End date">
          <Input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value || '')}
          />
        </FilterField>
        <FilterField label="Company" optional>
          <SelectCompany
            value={companyId}
            onValueChange={(value) => setCompanyId(value ?? '')}
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
          <div className="border-t bg-muted/30 px-4 py-2 text-sm font-medium space-y-1">
            <div>
              Total credits consumed: {totalCreditsConsumed.toFixed(2)}
            </div>
            <div>Total bookings: {totalBookings}</div>
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

