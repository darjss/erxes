import { useQuery } from '@apollo/client';
import {
  Badge,
  Button,
  Dialog,
  EnumCursorDirection,
  mergeCursorData,
  RecordTable,
  RecordTableInlineCell,
  validateFetchMore,
} from 'erxes-ui';
import { useEffect, useMemo, useRef } from 'react';
import { ONE_FIT_BOOKINGS } from '~/modules/booking/graphql/bookingQueries';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';
import { OneFitCustomersInline } from '~/modules/onefitCustomer/components/OneFitCustomersInline';
import type { OneFitCustomer } from '~/modules/onefitCustomer/types/onefitCustomer';
import { format, parseISO } from 'date-fns';
import { ColumnDef } from '@tanstack/table-core';
import { BookingStatus, OneFitBooking } from '~/modules/booking/types/booking';

const BOOKINGS_PER_PAGE = 100;
const ACCOUNT_STATEMENT_DETAILS_CURSOR_KEY =
  'account_statement_row_details_bookings';

interface AccountStatementRow {
  year: number;
  month: number;
  providerId: string;
  provider?: {
    _id: string;
    businessName?: { en?: string; mn?: string };
  } | null;
  creditsEarnedCompleted: number;
  creditsEarnedNoShow: number;
  bookingCountCompleted: number;
  bookingCountNoShow: number;
  amountEarnedCompleted: number;
  amountEarnedNoShow: number;
}

interface AccountStatementRowDetailsDialogProps {
  row: AccountStatementRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getStatusBadgeVariant(
  status: BookingStatus,
): 'success' | 'destructive' | 'info' | 'warning' | 'secondary' {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return 'success';
    case BookingStatus.CANCELLED:
      return 'destructive';
    case BookingStatus.COMPLETED:
      return 'info';
    case BookingStatus.NO_SHOW:
      return 'warning';
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.CONFIRMED:
      return 'Confirmed';
    case BookingStatus.CANCELLED:
      return 'Cancelled';
    case BookingStatus.COMPLETED:
      return 'Completed';
    case BookingStatus.NO_SHOW:
      return 'No Show';
    default:
      return status ?? '—';
  }
}

export function AccountStatementRowDetailsDialog({
  row,
  open,
  onOpenChange,
}: AccountStatementRowDetailsDialogProps) {
  const { mode } = useOneFitMode();
  const isMasterMode = mode === 'master';
  const { year, month, providerId } = row ?? {
    year: 0,
    month: 0,
    providerId: '',
  };
  const startDate = useMemo(() => {
    if (!year || !month) return undefined;
    return new Date(year, month - 1, 1);
  }, [year, month]);
  const endDate = useMemo(() => {
    if (!year || !month) return undefined;
    return new Date(year, month, 0, 23, 59, 59, 999);
  }, [year, month]);

  const baseVariables = useMemo(
    () => ({
      providerId: providerId || undefined,
      startDate: startDate ?? undefined,
      endDate: endDate ?? undefined,
      limit: BOOKINGS_PER_PAGE,
      direction: 'forward' as const,
    }),
    [providerId, startDate, endDate],
  );

  const { data, loading, fetchMore } = useQuery(ONE_FIT_BOOKINGS, {
    variables: {
      ...baseVariables,
      cursor: undefined,
    },
    skip: !open || !row || !providerId,
  });

  const { list: allBookingsRaw = [], pageInfo } = data?.oneFitBookings ?? {};
  const isFetchingAllPagesRef = useRef(false);
  const hasFetchedAllPagesRef = useRef(false);

  useEffect(() => {
    isFetchingAllPagesRef.current = false;
    hasFetchedAllPagesRef.current = false;
  }, [open, providerId, year, month]);

  useEffect(() => {
    if (!open || loading || !pageInfo?.hasNextPage || !pageInfo?.endCursor) return;
    if (isFetchingAllPagesRef.current || hasFetchedAllPagesRef.current) return;

    let cancelled = false;
    isFetchingAllPagesRef.current = true;

    const fetchAllPages = async () => {
      let hasNextPage = !!pageInfo.hasNextPage;
      let nextCursor = pageInfo.endCursor;

      while (!cancelled && hasNextPage && nextCursor) {
        const result = await fetchMore({
          variables: {
            ...baseVariables,
            cursor: nextCursor,
            limit: BOOKINGS_PER_PAGE,
            direction: EnumCursorDirection.FORWARD,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              oneFitBookings: mergeCursorData({
                direction: EnumCursorDirection.FORWARD,
                fetchMoreResult: fetchMoreResult.oneFitBookings,
                prevResult: prev.oneFitBookings,
              }),
            };
          },
        });

        const nextPageInfo = result?.data?.oneFitBookings?.pageInfo;
        hasNextPage = !!nextPageInfo?.hasNextPage;
        nextCursor = nextPageInfo?.endCursor;
      }

      if (!cancelled) {
        hasFetchedAllPagesRef.current = true;
      }
      isFetchingAllPagesRef.current = false;
    };

    fetchAllPages().catch(() => {
      isFetchingAllPagesRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [
    open,
    loading,
    pageInfo?.hasNextPage,
    pageInfo?.endCursor,
    fetchMore,
    baseVariables,
  ]);

  const allBookings = allBookingsRaw;
  const bookings = useMemo(
    () =>
      allBookings.filter(
        (b: OneFitBooking) =>
          b.status === BookingStatus.COMPLETED ||
          b.status === BookingStatus.NO_SHOW,
      ),
    [allBookings],
  );

  const handleFetchMore = ({
    direction,
  }: {
    direction: EnumCursorDirection;
  }) => {
    if (
      !validateFetchMore({
        direction,
        pageInfo,
      })
    ) {
      return;
    }
    const nextCursor =
      direction === EnumCursorDirection.FORWARD
        ? pageInfo?.endCursor
        : pageInfo?.startCursor;
    fetchMore({
      variables: {
        ...baseVariables,
        cursor: nextCursor,
        limit: BOOKINGS_PER_PAGE,
        direction,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          oneFitBookings: mergeCursorData({
            direction,
            fetchMoreResult: fetchMoreResult.oneFitBookings,
            prevResult: prev.oneFitBookings,
          }),
        };
      },
    });
  };

  const { hasPreviousPage, hasNextPage } = pageInfo ?? {};
  const totalCredits = useMemo(
    () =>
      bookings.reduce(
        (sum: number, b: OneFitBooking) => sum + (b.creditCost ?? 0),
        0,
      ),
    [bookings],
  );
  const totalPriceCompleted = row?.amountEarnedCompleted ?? 0;
  const totalPriceNoShow = row?.amountEarnedNoShow ?? 0;
  const totalPrice = totalPriceCompleted + totalPriceNoShow;
  const providerName = row?.provider?.businessName
    ? getLocalizedString(row.provider.businessName, 'en')
    : providerId || '—';
  const title = row
    ? `Bookings — ${year}-${String(month).padStart(2, '0')} — ${providerName}`
    : 'Bookings';

  const columns: ColumnDef<OneFitBooking>[] = [
    {
      accessorKey: 'bookingId',
      header: 'Booking ID',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs font-mono">
          {(cell.getValue() as string) ?? '—'}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row: r }) => (
        <RecordTableInlineCell>
          <OneFitCustomersInline
            customers={
              r.original.user ? ([r.original.user] as OneFitCustomer[]) : []
            }
            placeholder="—"
          />
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'activityType',
      header: 'Activity',
      cell: ({ row: r }) => (
        <RecordTableInlineCell className="text-xs">
          {r.original.activityType
            ? getLocalizedString(r.original.activityType.name, 'en')
            : '—'}
        </RecordTableInlineCell>
      ),
    },
    {
      accessorKey: 'bookingDate',
      header: 'Date',
      cell: ({ cell }) => {
        const v = cell.getValue() as string | undefined;
        if (!v) return <RecordTableInlineCell>—</RecordTableInlineCell>;
        const d = typeof v === 'string' ? parseISO(v) : new Date(v);
        return (
          <RecordTableInlineCell className="text-xs">
            {format(d, 'yyyy-MM-dd')}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => (
        <RecordTableInlineCell>
          <Badge
            variant={getStatusBadgeVariant(cell.getValue() as BookingStatus)}
          >
            {getStatusLabel(cell.getValue() as BookingStatus)}
          </Badge>
        </RecordTableInlineCell>
      ),
    },
    ...(isMasterMode
      ? [
          {
            accessorKey: 'creditCost',
            header: 'Credits',
            cell: ({ cell }: { cell: any }) => (
              <RecordTableInlineCell className="text-xs">
                {(cell.getValue() as number)?.toFixed(2) ?? '—'}
              </RecordTableInlineCell>
            ),
          },
        ]
      : []),
    {
      accessorKey: 'price',
      header: 'Amount',
      cell: ({ cell }) => (
        <RecordTableInlineCell className="text-xs">
          {(cell.getValue() as number) != null
            ? (cell.getValue() as number).toFixed(2)
            : '—'}
        </RecordTableInlineCell>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-6xl max-h-[80vh] flex flex-col">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>
            {row
              ? `${
                  row.bookingCountCompleted + row.bookingCountNoShow
                } completed or no-show bookings`
              : ''}
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex-1 min-h-0 px-6 overflow-x-scroll overflow-y-auto">
          {loading && (
            <div className="text-sm text-muted-foreground py-4">Loading…</div>
          )}
          {!loading && bookings.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              No completed or no-show bookings for this period.
            </p>
          )}
          {!loading && bookings.length > 0 && (
            <RecordTable.Provider
              columns={columns}
              data={bookings}
              className="m-0 border rounded-md "
            >
              <RecordTable.CursorProvider
                hasPreviousPage={!!hasPreviousPage}
                hasNextPage={!!hasNextPage}
                dataLength={bookings.length}
                sessionKey={ACCOUNT_STATEMENT_DETAILS_CURSOR_KEY}
              >
                <RecordTable>
                  <RecordTable.Header />
                  <RecordTable.Body>
                    <RecordTable.CursorBackwardSkeleton
                      handleFetchMore={handleFetchMore}
                    />
                    <RecordTable.RowList />
                    <RecordTable.CursorForwardSkeleton
                      handleFetchMore={handleFetchMore}
                    />
                  </RecordTable.Body>
                </RecordTable>
              </RecordTable.CursorProvider>
            </RecordTable.Provider>
          )}
        </div>
        {!loading && bookings.length > 0 && (
          <div className="flex-shrink-0 border-t bg-muted/30 px-6 py-2 text-sm font-medium space-y-1">
            {isMasterMode && (
              <div>Total credits: {totalCredits.toFixed(2)}</div>
            )}
            <div>
              Total amount (completed): {totalPriceCompleted.toFixed(2)}
            </div>
            {isMasterMode && (
              <>
                <div>Total amount (no-show): {totalPriceNoShow.toFixed(2)}</div>
                <div>Total amount: {totalPrice.toFixed(2)}</div>
              </>
            )}
          </div>
        )}
        <Dialog.Footer>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
