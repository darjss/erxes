import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconBuilding, IconClipboardTextFilled } from '@tabler/icons-react';

export const BtkAdminNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Company info"
        icon={IconBuilding}
        pathPrefix="btkadmin"
        path="company-info"
      />
      <NavigationMenuLinkItem
        name="News"
        icon={IconClipboardTextFilled}
        pathPrefix="btkadmin"
        path="news"
      />
    </>
  );
};
