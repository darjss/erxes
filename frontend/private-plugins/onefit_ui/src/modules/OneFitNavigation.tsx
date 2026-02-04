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
  IconPhoto,
  IconTicket,
} from '@tabler/icons-react';
import { useOneFitMode } from './config/hooks/useOneFitMode';

export const OneFitNavigation = () => {
  const { isSlaveMode } = useOneFitMode();

  return (
    <>
      <NavigationMenuLinkItem
        name="OneFit"
        icon={IconActivity}
        pathPrefix="onefit"
        path=""
      />
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Customers"
          icon={IconUsers}
          pathPrefix="onefit"
          path="customers"
        />
      )}

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
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Categories"
          icon={IconTags}
          pathPrefix="onefit"
          path="categories"
        />
      )}
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Membership Plans"
          icon={IconCreditCard}
          pathPrefix="onefit"
          path="membership-plans"
        />
      )}
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Membership Purchases"
          icon={IconShoppingCart}
          pathPrefix="onefit"
          path="membership-purchases"
        />
      )}
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Credit Transactions"
          icon={IconCoins}
          pathPrefix="onefit"
          path="credit-transactions"
        />
      )}
      <NavigationMenuLinkItem
        name="Providers"
        icon={IconBuildingStore}
        pathPrefix="onefit"
        path="providers"
      />
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Banners"
          icon={IconPhoto}
          pathPrefix="onefit"
          path="banners"
        />
      )}
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Promo Codes"
          icon={IconTicket}
          pathPrefix="onefit"
          path="promo-codes"
        />
      )}
    </>
  );
};
