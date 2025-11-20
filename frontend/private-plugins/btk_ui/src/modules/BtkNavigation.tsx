import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconBuilding, IconClipboardTextFilled } from '@tabler/icons-react';

export const BtkNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Company info"
        icon={IconBuilding}
        pathPrefix="btk"
        path="company-info"
      />
      <NavigationMenuLinkItem
        name="News"
        icon={IconClipboardTextFilled}
        pathPrefix="btk"
        path="news"
      />
    </>
  );
};
