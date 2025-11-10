import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconBuilding } from '@tabler/icons-react';

export const BlockNavigation = () => {
  return (
    <NavigationMenuLinkItem
      name="Block Admin"
      icon={IconBuilding}
      pathPrefix="block-admin"
      path="block-admin"
    />
  );
};
