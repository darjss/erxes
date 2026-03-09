import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Button, ToggleGroup } from 'erxes-ui';
import { IconCalendarMonth, IconQrcode, IconList } from '@tabler/icons-react';
import { BookingsList } from '~/modules/booking/components/BookingsList';
import { BookingsCalendar } from '~/modules/booking/components/BookingsCalendar';
import { CreateBookingDialog } from '~/modules/booking/components/CreateBookingDialog';
import { BookingFiltersComponent } from '~/modules/booking/components/BookingFilters';
import {
  BookingFilters,
  OneFitBooking,
  BookingStatus,
} from '~/modules/booking/types/booking';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';
import { ActivityLanguage } from '~/modules/activity-type/utils/localization';
import { ScanBookingQrDialog } from '~/modules/booking/components/ScanBookingQrDialog';
import { BulkAttendanceResultDialog } from '~/modules/booking/components/BulkAttendanceResultDialog';
import { ConfirmBookingAttendanceDialog } from '~/modules/booking/components/ConfirmBookingAttendanceDialog';
import { SelectCustomerBookingDialog } from '~/modules/booking/components/SelectCustomerBookingDialog';
import { ONE_FIT_BOOKINGS } from '~/modules/booking/graphql/bookingQueries';
import {
  useMarkAttendanceBulk,
  MarkAttendanceBulkResult,
} from '~/modules/booking/hooks/useBookingMutations';
import { toast } from 'erxes-ui';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

type BookingsView = 'list' | 'calendar';

export function BookingsPage() {
  const { isSlaveMode } = useOneFitMode();
  const { markAttendanceBulk, loading: markAllLoading } =
    useMarkAttendanceBulk();
  const [view, setView] = useState<BookingsView>('list');
  const [filters, setFilters] = useState<BookingFilters>({});
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmBooking, setConfirmBooking] = useState<OneFitBooking | null>(
    null,
  );
  const [pickerBookings, setPickerBookings] = useState<OneFitBooking[]>([]);
  const [bulkResult, setBulkResult] = useState<MarkAttendanceBulkResult | null>(
    null,
  );
  const [bulkResultDialogOpen, setBulkResultDialogOpen] = useState(false);
  const [language, setLanguage] = useState<ActivityLanguage>('en');

  const [fetchBookingsByCustomer, { loading: bookingsLoading }] = useLazyQuery(
    ONE_FIT_BOOKINGS,
    {
      onCompleted(data) {
        const list = data?.oneFitBookings?.list ?? [];
        if (list.length === 0) {
          setConfirmDialogOpen(false);
          toast({
            title: 'Захиалга байхгүй',
            description: 'Энэ гишүүнд захиалга олдсонгүй.',
          });
          return;
        }
        if (list.length === 1) {
          setConfirmBooking(list[0]);
          setConfirmDialogOpen(true);
          return;
        }
        setConfirmDialogOpen(false);
        setPickerBookings(list);
        setPickerOpen(true);
      },
    },
  );

  function handleScanSuccess(customerId: string) {
    setScanDialogOpen(false);
    setConfirmBooking(null);
    setConfirmDialogOpen(true);
    fetchBookingsByCustomer({
      variables: {
        userId: customerId,
        status: BookingStatus.CONFIRMED,
        limit: 10,
      },
    });
  }

  function handleConfirmDialogClose() {
    setConfirmDialogOpen(false);
    setConfirmBooking(null);
  }

  function handleSelectBooking(booking: OneFitBooking) {
    setPickerOpen(false);
    setPickerBookings([]);
    setConfirmBooking(booking);
    setConfirmDialogOpen(true);
  }

  async function handleMarkAllBookings(bookingIds: string[]) {
    const result = await markAttendanceBulk(bookingIds, { skipToast: true });
    setPickerOpen(false);
    setPickerBookings([]);
    if (result) {
      setBulkResult(result);
      setBulkResultDialogOpen(true);
    }
  }

  function handleBulkResultDialogClose() {
    setBulkResultDialogOpen(false);
    setBulkResult(null);
  }

  function ListOrCalendarComponent({
    filters: f,
  }: {
    filters: BookingFilters;
    language: ActivityLanguage;
  }) {
    if (view === 'calendar') return <BookingsCalendar filters={f} />;
    return <BookingsList filters={f} preferredLanguage={language} />;
  }

  return (
    <>
      <OneFitListPageLayout
        pageName="Bookings"
        filters={filters}
        onFiltersChange={setFilters}
        filtersComponent={BookingFiltersComponent}
        createDialog={
          <div className="flex items-center gap-2">
            {!isSlaveMode && <CreateBookingDialog />}
            <Button
              type="button"
              variant="outline"
              onClick={() => setScanDialogOpen(true)}
            >
              <IconQrcode className="h-4 w-4 mr-2" />
              Гишүүн ирц бүртгэх
            </Button>
          </div>
        }
        listComponent={({ filters }) => (
          <ListOrCalendarComponent filters={filters} language={language} />
        )}
        headerActions={
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && setView(v as BookingsView)}
              variant="outline"
              size="sm"
            >
              <ToggleGroup.Item value="list" aria-label="List view">
                <IconList className="h-4 w-4 mr-1.5" />
                List
              </ToggleGroup.Item>
              <ToggleGroup.Item value="calendar" aria-label="Calendar view">
                <IconCalendarMonth className="h-4 w-4 mr-1.5" />
                Calendar
              </ToggleGroup.Item>
            </ToggleGroup>

            <ToggleGroup
              type="single"
              value={language}
              onValueChange={(value) => {
                if (value === 'en' || value === 'mn') {
                  setLanguage(value);
                }
              }}
              variant="outline"
              size="sm"
            >
              <ToggleGroup.Item value="en" aria-label="English">
                EN
              </ToggleGroup.Item>
              <ToggleGroup.Item value="mn" aria-label="Mongolian">
                MN
              </ToggleGroup.Item>
            </ToggleGroup>
          </div>
        }
      />

      <ScanBookingQrDialog
        open={scanDialogOpen}
        onOpenChange={setScanDialogOpen}
        onScanSuccess={handleScanSuccess}
      />

      <ConfirmBookingAttendanceDialog
        booking={confirmBooking}
        loading={bookingsLoading}
        error={null}
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onClose={handleConfirmDialogClose}
      />

      <SelectCustomerBookingDialog
        bookings={pickerBookings}
        open={pickerOpen}
        onOpenChange={(open) => {
          setPickerOpen(open);
          if (!open) setPickerBookings([]);
        }}
        onSelectBooking={handleSelectBooking}
        onMarkAll={handleMarkAllBookings}
        markAllLoading={markAllLoading}
      />

      <BulkAttendanceResultDialog
        result={bulkResult}
        open={bulkResultDialogOpen}
        onOpenChange={setBulkResultDialogOpen}
        onClose={handleBulkResultDialogClose}
      />
    </>
  );
}
