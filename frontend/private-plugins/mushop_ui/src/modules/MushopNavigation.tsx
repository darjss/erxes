import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconCreditCard, IconPackage, IconUsers } from '@tabler/icons-react';

export const MushopNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="suppliers"
        icon={IconUsers}
        path="suppliers"
        pathPrefix="mushop"
      />
      <NavigationMenuLinkItem
        name="products"
        icon={IconPackage}
        path="products"
        pathPrefix="mushop"
      />
      <NavigationMenuLinkItem
        name="subscribers"
        icon={IconCreditCard}
        path="subscribers"
        pathPrefix="mushop"
      />
    </>
  );
};
