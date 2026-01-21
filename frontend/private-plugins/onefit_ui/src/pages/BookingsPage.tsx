import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from 'erxes-ui';
import { IconQrcode } from '@tabler/icons-react';
import { BookingsList } from '~/modules/booking/components/BookingsList';
import { CreateBookingDialog } from '~/modules/booking/components/CreateBookingDialog';
import { BookingFiltersComponent } from '~/modules/booking/components/BookingFilters';
import { BookingFilters, OneFitBooking } from '~/modules/booking/types/booking';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';
import { ScanBookingQrDialog } from '~/modules/booking/components/ScanBookingQrDialog';
import { ConfirmBookingAttendanceDialog } from '~/modules/booking/components/ConfirmBookingAttendanceDialog';
import { ONE_FIT_BOOKING_BY_BOOKING_ID } from '~/modules/booking/graphql/bookingQueries';
import { toast } from 'erxes-ui';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

export function BookingsPage() {
  const { isSlaveMode } = useOneFitMode();
  const [filters, setFilters] = useState<BookingFilters>({});
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [scannedBookingId, setScannedBookingId] = useState<string | null>(null);

  const { data: bookingData, loading: bookingLoading, error: bookingError } = useQuery(
    ONE_FIT_BOOKING_BY_BOOKING_ID,
    {
      variables: { bookingId: scannedBookingId || '' },
      skip: !scannedBookingId || !confirmDialogOpen,
    },
  );

  const booking: OneFitBooking | null = bookingData?.oneFitBookingByBookingId || null;

  function handleScanSuccess(bookingId: string) {
    console.log('handleScanSuccess bookingId', bookingId);
    setScannedBookingId(bookingId);
    setScanDialogOpen(false);
    setConfirmDialogOpen(true);
  }

  function handleConfirmDialogClose() {
    setConfirmDialogOpen(false);
    setScannedBookingId(null);
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
        booking={booking}
        loading={bookingLoading}
        error={bookingError || null}
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onClose={handleConfirmDialogClose}
      />
    </>
  );
}
