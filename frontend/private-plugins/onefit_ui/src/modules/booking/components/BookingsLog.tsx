import { ColumnDef } from '@tanstack/table-core';
import {
  Badge,
  RecordTable,
  RecordTableInlineCell,
  RelativeDateDisplay,
} from 'erxes-ui';
import { useBookings } from '../hooks/useBookings';
import {
  AttendanceStatus,
  BookingFilters,
} from '../types/booking';
import { BOOKINGS_LOG_CURSOR_SESSION_KEY } from '../constants/bookingCursorSessionKey';
import {
  ActivityLanguage,
  getLocalizedString,
} from '~/modules/activity-type/utils/localization';
import { OneFitCustomer } from '@/credit/types/credit';

interface BookingsLogProps {
  filters?: BookingFilters;
  preferredLanguage?: ActivityLanguage;
}

const getAttendanceBadgeVariant = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.ATTENDED:
      return 'success';
    case AttendanceStatus.NO_SHOW:
      return 'warning';
    case AttendanceStatus.PENDING:
    default:
      return 'secondary';
  }
};

const getAttendanceLabel = (
  status: AttendanceStatus,
  language: ActivityLanguage,
): string => {
  const labels: Record<ActivityLanguage, Record<AttendanceStatus, string>> = {
    en: {
      [AttendanceStatus.PENDING]: 'Pending',
      [AttendanceStatus.ATTENDED]: 'Attended',
      [AttendanceStatus.NO_SHOW]: 'No show',
    },
    mn: {
      [AttendanceStatus.PENDING]: 'Хүлээгдэж буй',
      [AttendanceStatus.ATTENDED]: 'Ирсэн',
      [AttendanceStatus.NO_SHOW]: 'Ирээгүй',
    },
  };

  return labels[language]?.[status] ?? status;
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

export function BookingsLog({
  filters,
  preferredLanguage = 'en',
}: BookingsLogProps) {
  const mergedFilters: BookingFilters = {
    ...(filters || {}),
    attendanceStatus: AttendanceStatus.ATTENDED,
  };

  const { bookings, loading, pageInfo, handleFetchMore } = useBookings(
    mergedFilters,
    { sessionKey: BOOKINGS_LOG_CURSOR_SESSION_KEY },
  );

  const { hasPreviousPage, hasNextPage } = pageInfo || {};

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'bookingDate',
      header: 'Date & Time',
      cell: ({ row }) => {
        const booking = row.original;
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
      accessorKey: 'user',
      id: 'name',
      header: 'Name',
      cell: ({ row }: { row: { original: any } }) => {
        const booking = row.original;
        const name = getDisplayName(booking.user);
        return (
          <RecordTableInlineCell
            className="text-xs font-medium truncate"
            title={name}
          >
            {name}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }: { row: { original: any } }) => {
        const booking = row.original;
        const provider = booking.provider;
        const providerName = provider?.businessName
          ? getLocalizedString(provider.businessName, preferredLanguage)
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
          ? getLocalizedString(activityType.name, preferredLanguage)
          : '-';
        return (
          <RecordTableInlineCell className="text-xs font-medium">
            {name}
          </RecordTableInlineCell>
        );
      },
    },
    {
      accessorKey: 'attendanceStatus',
      header: 'Attendance',
      cell: ({ cell }) => {
        const status = cell.getValue() as AttendanceStatus;
        const label = getAttendanceLabel(status, preferredLanguage);
        return (
          <RecordTableInlineCell>
            <Badge
              variant={getAttendanceBadgeVariant(status)}
              className="capitalize"
            >
              {label}
            </Badge>
          </RecordTableInlineCell>
        );
      },
    },
  ];

  return (
    <RecordTable.Provider
      columns={columns}
      data={bookings || []}
      className="m-3"
    >
      <RecordTable.CursorProvider
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        dataLength={bookings?.length}
        sessionKey={BOOKINGS_LOG_CURSOR_SESSION_KEY}
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
  );
}

