import {
  IconBike,
  IconBuildingStore,
  IconCalendar,
  IconCreditCard,
  IconLayoutDashboard,
  IconTags,
  IconUsers,
} from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { MainIndicatorsDashboard } from '~/components/dashboard/MainIndicatorsDashboard';
import { OneFitPageLayout } from '~/components/OneFitPageLayout';
import { useOneFitMode } from '~/modules/config/hooks/useOneFitMode';

export function DashboardPage() {
  const { isSlaveMode } = useOneFitMode();

  return (
    <OneFitPageLayout
      pageName="Dashboard"
      pageIcon={<IconLayoutDashboard className="size-4" />}
    >
      <div className="flex h-full overflow-hidden">
        <div className="flex flex-col h-full overflow-auto flex-auto p-6">
          <MainIndicatorsDashboard />
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick links</h2>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link to="/onefit/bookings">
                  <IconCalendar />
                  View Bookings
                </Link>
              </Button>
              {!isSlaveMode && (
                <Button asChild>
                  <Link to="/onefit/customers">
                    <IconUsers />
                    View Customers
                  </Link>
                </Button>
              )}
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
              {!isSlaveMode && (
                <Button asChild>
                  <Link to="/onefit/categories">
                    <IconTags />
                    View Categories
                  </Link>
                </Button>
              )}
              {!isSlaveMode && (
                <Button asChild>
                  <Link to="/onefit/membership-plans">
                    <IconCreditCard />
                    View Membership Plans
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </OneFitPageLayout>
  );
}
