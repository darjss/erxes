import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  Button,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useBookings } from '../hooks/useBookings';
import {
  BookingFilters,
  BookingStatus,
  AttendanceStatus,
} from '../types/booking';
import { BOOKINGS_CURSOR_SESSION_KEY } from '../constants/bookingCursorSessionKey';
import { CancelBookingDialog } from './CancelBookingDialog';
import { MarkAttendanceDialog } from './MarkAttendanceDialog';
import { useState } from 'react';
import { OneFitCustomersInline } from '~/modules/onefitCustomer/components/OneFitCustomersInline';
import { getLocalizedString } from '~/modules/activity-type/utils/localization';
import { OneFitCustomer } from '@/credit/types/credit';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

interface BookingsListProps {
  filters?: BookingFilters;
}

const getStatusBadgeVariant = (status: BookingStatus) => {
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
};

const getAttendanceBadgeVariant = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.ATTENDED:
      return 'success';
    case AttendanceStatus.NO_SHOW:
      return 'warning';
    case AttendanceStatus.PENDING:
      return 'secondary';
    default:
      return 'secondary';
  }
};

const getDisplayName = (user: OneFitCustomer | undefined): string => {
  if (!user) return '-';
  return (
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.primaryEmail ||
    user.primaryPhone ||
    'Unnamed user'
  );
};

export const BookingsList = ({ filters }: BookingsListProps) => {
  const { bookings, handleFetchMore, loading, pageInfo } = useBookings(filters);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const { isSlaveMode } = useOneFitMode();

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'bookingId',
      header: 'Booking ID',
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <RecordTableInlineCell className="text-xs font-medium font-mono">
            {booking.bookingId ?? '-'}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => {
        const booking = row.original;
        const user: OneFitCustomer | undefined = booking.user;
        if (!user) {
          return (
            <RecordTableInlineCell className="text-xs font-medium text-muted-foreground">
              -
            </RecordTableInlineCell>
          );
        }
        return (
          <RecordTableInlineCell>
            <OneFitCustomersInline
              customers={[user]}
              placeholder="Unnamed user"
            />
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'user',
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const booking = row.original;
        const name = getDisplayName(booking.user);
        return (
          <RecordTableInlineCell className="text-xs font-medium truncate" title={name}>
            {name}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }) => {
        const booking = row.original;
        const provider = booking.provider;
        const providerName = provider?.businessName
          ? getLocalizedString(provider.businessName, 'en')
          : '-';
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {providerName}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'activityType',
      header: 'Activity Type',
      cell: ({ row }) => {
        const booking = row.original;
        const activityType = booking.activityType;
        const name = activityType?.name
          ? getLocalizedString(activityType.name, 'en')
          : '-';
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {name}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'bookingDate',
      header: 'Date & Time',
      cell: ({ row }) => {
        const booking = row.original;
        const dateTime = `${booking.bookingDate} ${booking.startTime} - ${booking.endTime}`;
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            <RelativeDateDisplay value={booking.bookingDate} asChild>
              <div className="flex flex-col">
                <RelativeDateDisplay.Value value={booking.bookingDate} />
                <span className="text-muted-foreground text-xs">
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
            </RelativeDateDisplay>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            <RelativeDateDisplay value={booking.createdAt} asChild>
              <RelativeDateDisplay.Value value={booking.createdAt} />
            </RelativeDateDisplay>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ cell }) => {
        const status = cell.getValue() as BookingStatus;
        return (
          <RecordTableInlineCell>
            <Badge
              variant={getStatusBadgeVariant(status)}
              className="capitalize"
            >
              {status}
            </Badge>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'attendanceStatus',
      header: 'Attendance',
      cell: ({ cell }) => {
        const status = cell.getValue() as AttendanceStatus;
        return (
          <RecordTableInlineCell>
            <Badge
              variant={getAttendanceBadgeVariant(status)}
              className="capitalize"
            >
              {status}
            </Badge>
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'creditCost',
      header: 'Credit Cost',
      cell: ({ cell }) => {
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {cell.getValue() as number}
          </RecordTableInlineCell>
        );
      },
    },
    ...(!isSlaveMode
      ? [
          {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
              const booking = row.original;
              const isCancelled = booking.status === BookingStatus.CANCELLED;
              const isCompleted = booking.status === BookingStatus.COMPLETED;

              return (
                <RecordTableInlineCell>
                  <div className="flex gap-2">
                    {!isCancelled && !isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking._id);
                          setCancelDialogOpen(true);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    {booking.status === BookingStatus.CONFIRMED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking._id);
                          setAttendanceDialogOpen(true);
                        }}
                      >
                        Mark Attendance
                      </Button>
                    )}
                  </div>
                </RecordTableInlineCell>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <RecordTable.Provider
        columns={columns}
        data={bookings || []}
        className="m-3"
      >
        <RecordTable.CursorProvider
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
          dataLength={bookings?.length}
          sessionKey={BOOKINGS_CURSOR_SESSION_KEY}
        >
          <RecordTable>
            <RecordTable.Header />
            <RecordTable.Body>
              <RecordTable.CursorBackwardSkeleton
                handleFetchMore={handleFetchMore}
              />
              {loading && <RecordTable.RowSkeleton rows={40} />}
              <RecordTable.RowList />
              <RecordTable.CursorForwardSkeleton
                handleFetchMore={handleFetchMore}
              />
            </RecordTable.Body>
          </RecordTable>
        </RecordTable.CursorProvider>
      </RecordTable.Provider>

      {selectedBooking && (
        <>
          <CancelBookingDialog
            bookingId={selectedBooking}
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
            onClose={() => {
              setCancelDialogOpen(false);
              setSelectedBooking(null);
            }}
          />
          <MarkAttendanceDialog
            bookingId={selectedBooking}
            open={attendanceDialogOpen}
            onOpenChange={setAttendanceDialogOpen}
            onClose={() => {
              setAttendanceDialogOpen(false);
              setSelectedBooking(null);
            }}
          />
        </>
      )}
    </>
  );
};
