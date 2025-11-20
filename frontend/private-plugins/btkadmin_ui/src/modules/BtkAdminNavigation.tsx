import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconBuilding, IconClipboardTextFilled } from '@tabler/icons-react';

export const BtkAdminNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Companies"
        icon={IconBuilding}
        pathPrefix="btkadmin"
        path="companies"
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
