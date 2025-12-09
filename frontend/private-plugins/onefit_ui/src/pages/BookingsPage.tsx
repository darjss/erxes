import {
  IconActivity,
  IconSettings,
  IconCaretDownFilled,
} from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  PageContainer,
  PageSubHeader,
  Separator,
  ScrollArea,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BookingsList } from '~/modules/booking/components/BookingsList';
import { CreateBookingDialog } from '~/modules/booking/components/CreateBookingDialog';
import { BookingFiltersComponent } from '~/modules/booking/components/BookingFilters';
import { BookingFilters } from '~/modules/booking/types/booking';

export const BookingsPage = () => {
  const [filters, setFilters] = useState<BookingFilters>({});

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/onefit">
                    <IconActivity />
                    OneFit
                  </Link>
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Button variant="ghost" disabled>
                  Bookings
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Button variant="outline" asChild>
            <Link to="/settings/onefit">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button>
            More <IconCaretDownFilled />
          </Button>
        </PageHeader.End>
      </PageHeader>
      <div className="flex flex-auto overflow-hidden flex-col">
        <PageSubHeader>
          <div className="flex items-center gap-2">
            <BookingFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
            <CreateBookingDialog />
          </div>
        </PageSubHeader>
        <ScrollArea className="flex-auto">
          <BookingsList filters={filters} />
        </ScrollArea>
      </div>
    </PageContainer>
  );
};

