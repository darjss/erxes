import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconClipboardList, IconSend, IconUser } from '@tabler/icons-react';

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
        name="submissions"
        icon={IconSend}
        path="submissions"
        pathPrefix="supplier"
      />
    </>
  );
};
