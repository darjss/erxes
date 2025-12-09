import { NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconActivity,
  IconCalendar,
  IconBike,
  IconTags,
  IconCreditCard,
  IconShoppingCart,
  IconCoins,
  IconUsers,
  IconBuildingStore,
  IconBuilding,
} from '@tabler/icons-react';

export const OneFitNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="OneFit"
        icon={IconActivity}
        pathPrefix="onefit"
        path=""
      />
      <NavigationMenuLinkItem
        name="Customers"
        icon={IconUsers}
        pathPrefix="onefit"
        path="customers"
      />

      <NavigationMenuLinkItem
        name="Bookings"
        icon={IconCalendar}
        pathPrefix="onefit"
        path="bookings"
      />
      <NavigationMenuLinkItem
        name="Schedules"
        icon={IconCalendar}
        pathPrefix="onefit"
        path="schedules"
      />
      <NavigationMenuLinkItem
        name="Activity Types"
        icon={IconBike}
        pathPrefix="onefit"
        path="activity-types"
      />
      <NavigationMenuLinkItem
        name="Categories"
        icon={IconTags}
        pathPrefix="onefit"
        path="categories"
      />
      <NavigationMenuLinkItem
        name="Membership Plans"
        icon={IconCreditCard}
        pathPrefix="onefit"
        path="membership-plans"
      />
      <NavigationMenuLinkItem
        name="Credit Transactions"
        icon={IconCoins}
        pathPrefix="onefit"
        path="credit-transactions"
      />
      <NavigationMenuLinkItem
        name="Providers"
        icon={IconBuildingStore}
        pathPrefix="onefit"
        path="providers"
      />
    </>
  );
};
