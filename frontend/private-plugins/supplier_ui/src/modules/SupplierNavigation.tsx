import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconUser } from '@tabler/icons-react';

export const SupplierNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="profile"
        icon={IconUser}
        path="profile"
        pathPrefix="supplier"
      />
    </>
  );
};
