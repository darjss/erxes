import {
  IconCalendar,
  IconUsers,
  IconBuildingStore,
  IconBike,
  IconTags,
  IconCreditCard,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { OneFitPageLayout } from '~/components/OneFitPageLayout';

export function IndexPage() {
  return (
    <OneFitPageLayout pageName="">
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden flex-auto p-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">OneFit</h1>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/onefit/bookings">
                  <IconCalendar />
                  View Bookings
                </Link>
              </Button>
              <Button asChild>
                <Link to="/onefit/customers">
                  <IconUsers />
                  View Customers
                </Link>
              </Button>
              <Button asChild>
                <Link to="/onefit/providers">
                  <IconBuildingStore />
                  View Providers
                </Link>
              </Button>
              <Button asChild>
                <Link to="/onefit/activity-types">
                  <IconBike />
                  View Activity Types
                </Link>
              </Button>
              <Button asChild>
                <Link to="/onefit/categories">
                  <IconTags />
                  View Categories
                </Link>
              </Button>
              <Button asChild>
                <Link to="/onefit/membership-plans">
                  <IconCreditCard />
                  View Membership Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OneFitPageLayout>
  );
}
