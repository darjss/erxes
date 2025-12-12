import { useState } from 'react';
import { BookingsList } from '~/modules/booking/components/BookingsList';
import { CreateBookingDialog } from '~/modules/booking/components/CreateBookingDialog';
import { BookingFiltersComponent } from '~/modules/booking/components/BookingFilters';
import { BookingFilters } from '~/modules/booking/types/booking';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';

export function BookingsPage() {
  const [filters, setFilters] = useState<BookingFilters>({});

  return (
    <OneFitListPageLayout
      pageName="Bookings"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={BookingFiltersComponent}
      createDialog={<CreateBookingDialog />}
      listComponent={BookingsList}
    />
  );
}
