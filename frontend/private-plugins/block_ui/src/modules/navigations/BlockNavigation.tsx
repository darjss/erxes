import { NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconBuilding,
  IconClipboardTextFilled,
  // IconStackFilled,
  // IconContract,
  // IconInvoice,
  // IconBuildingCommunity,
  // IconNavigation,
  // IconCoins,
} from '@tabler/icons-react';

export const BlockNavigation = () => {
  return (
    <>
      <div className="relative">
        <span className="absolute blk:-top-6.5 blk:left-8 bg-sidebar font-semibold text-xs text-accent-foreground">
          Block developers modules
        </span>
      </div>
      <NavigationMenuLinkItem
        name="Developer Info"
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
    </>
  );
};
