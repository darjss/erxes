import { NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconClipboardTextFilled,
  IconLayoutDashboardFilled,
  IconStackFilled,
} from '@tabler/icons-react';

export const BlockNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Dashboard"
        icon={IconLayoutDashboardFilled}
        pathPrefix="block"
        path="dashboard"
      />
      <NavigationMenuLinkItem
        name="Projects"
        icon={IconClipboardTextFilled}
        pathPrefix="block"
        path="projects"
      />
      <NavigationMenuLinkItem
        name="Stacking Plan"
        icon={IconStackFilled}
        pathPrefix="block"
        path="stacking-plan"
      />
    </>
  );
};
