import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Button } from 'erxes-ui';
import { IconQrcode } from '@tabler/icons-react';
import { BookingsList } from '~/modules/booking/components/BookingsList';
import { CreateBookingDialog } from '~/modules/booking/components/CreateBookingDialog';
import { BookingFiltersComponent } from '~/modules/booking/components/BookingFilters';
import {
  BookingFilters,
  OneFitBooking,
  BookingStatus,
} from '~/modules/booking/types/booking';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';
import { ScanBookingQrDialog } from '~/modules/booking/components/ScanBookingQrDialog';
import { ConfirmBookingAttendanceDialog } from '~/modules/booking/components/ConfirmBookingAttendanceDialog';
import { SelectCustomerBookingDialog } from '~/modules/booking/components/SelectCustomerBookingDialog';
import { ONE_FIT_BOOKINGS } from '~/modules/booking/graphql/bookingQueries';
import { toast } from 'erxes-ui';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

export function BookingsPage() {
  const { isSlaveMode } = useOneFitMode();
  const [filters, setFilters] = useState<BookingFilters>({});
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmBooking, setConfirmBooking] = useState<OneFitBooking | null>(
    null,
  );
  const [pickerBookings, setPickerBookings] = useState<OneFitBooking[]>([]);

  const [fetchBookingsByCustomer, { loading: bookingsLoading }] = useLazyQuery(
    ONE_FIT_BOOKINGS,
    {
      onCompleted(data) {
        const list = data?.oneFitBookings?.list ?? [];
        if (list.length === 0) {
          setConfirmDialogOpen(false);
          toast({
            title: 'No bookings',
            description: 'No bookings found for this customer.',
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
              Scan QR Code
            </Button>
          </div>
        }
        listComponent={BookingsList}
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
        onOpenChange={setPickerOpen}
        onSelectBooking={handleSelectBooking}
      />
    </>
  );
}
