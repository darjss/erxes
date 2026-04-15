import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconClipboardList, IconUser } from '@tabler/icons-react';

export const SupplierNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="profile"
        icon={IconUser}
        path="profile"
        pathPrefix="supplier"
      />
      <NavigationMenuLinkItem
        name="inventory"
        icon={IconClipboardList}
        path="inventory"
        pathPrefix="supplier"
      />
    </>
  );
};
