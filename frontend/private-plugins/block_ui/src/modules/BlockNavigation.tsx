import { NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconBuilding,
  IconClipboardTextFilled,
  IconStackFilled,
} from '@tabler/icons-react';

export const BlockNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Company Info"
        icon={IconBuilding}
        pathPrefix="block"
        path="developer-info"
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
