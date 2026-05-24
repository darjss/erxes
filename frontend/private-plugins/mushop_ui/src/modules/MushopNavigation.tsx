import { NavigationMenuLinkItem } from 'erxes-ui';
import { Can } from 'ui-modules';
import {
  IconBuildingStore,
  IconCreditCard,
  IconPackage,
  IconUsers,
} from '@tabler/icons-react';

export const MushopNavigation = () => {
  return (
    <>
      <Can module="supplier">
        <NavigationMenuLinkItem
          name="suppliers"
          icon={IconUsers}
          path="suppliers"
          pathPrefix="mushop"
        />
      </Can>
      <Can module="product">
        <NavigationMenuLinkItem
          name="products"
          icon={IconPackage}
          path="products"
          pathPrefix="mushop"
        />
      </Can>
      <Can module="subscription">
        <NavigationMenuLinkItem
          name="subscribers"
          icon={IconCreditCard}
          path="subscribers"
          pathPrefix="mushop"
        />
      </Can>
      <Can module="collective">
        <NavigationMenuLinkItem
          name="collectives"
          icon={IconBuildingStore}
          path="collectives"
          pathPrefix="mushop"
        />
      </Can>
    </>
  );
};
