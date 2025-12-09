import {
  IconCaretDownFilled,
  IconActivity,
  IconSettings,
  IconCalendar,
  IconUsers,
  IconBuildingStore,
  IconBike,
  IconTags,
  IconCreditCard,
  IconShoppingCart,
} from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';

export const IndexPage = () => {
  return (
    <div className="flex flex-col h-full">
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
                <Link to="/onefit/users">
                  <IconUsers />
                  View Users
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
    </div>
  );
};
