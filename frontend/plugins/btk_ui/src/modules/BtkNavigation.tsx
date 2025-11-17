import { NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconBuilding,
  IconClipboardTextFilled,
  IconStackFilled,
} from '@tabler/icons-react';

export const BtkNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Developer Info"
        icon={IconBuilding}
        pathPrefix="btk"
        path="developer-info"
      />
      <NavigationMenuLinkItem
        name="Projects"
        icon={IconClipboardTextFilled}
        pathPrefix="btk"
        path="projects"
      />
      <NavigationMenuLinkItem
        name="Stacking Plan"
        icon={IconStackFilled}
        pathPrefix="btk"
        path="stacking-plan"
      />
    </>
  );
};
