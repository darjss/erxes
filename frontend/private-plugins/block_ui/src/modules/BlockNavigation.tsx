import { Badge, NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconBuilding,
  IconClipboardTextFilled,
  IconStackFilled,
  IconContract,
  IconInvoice,
  IconBuildingCommunity,
  IconNavigation,
  IconCoins,
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
      <NavigationMenuLinkItem
        name="Stacking Plan"
        icon={IconStackFilled}
        pathPrefix="block"
        path="stacking-plan"
      >
        <Badge>Enterprise</Badge>
      </NavigationMenuLinkItem>
      <NavigationMenuLinkItem
        name="Building Man..."
        icon={IconBuildingCommunity}
        pathPrefix="block"
        path="bm"
      >
        <Badge>Enterprise</Badge>
      </NavigationMenuLinkItem>
      <NavigationMenuLinkItem
        name="Finance & leas"
        icon={IconCoins}
        pathPrefix="block"
        path="finance-lease"
      >
        <Badge>Enterprise</Badge>
      </NavigationMenuLinkItem>
      <NavigationMenuLinkItem
        name="Contracts"
        icon={IconContract}
        pathPrefix="block"
        path="contracts"
      >
        <Badge>Enterprise</Badge>
      </NavigationMenuLinkItem>
      <NavigationMenuLinkItem
        name="Invoices"
        icon={IconInvoice}
        pathPrefix="block"
        path="invoices"
      >
        <Badge>Enterprise</Badge>
      </NavigationMenuLinkItem>
      <NavigationMenuLinkItem
        name="RFQ & EOI"
        icon={IconNavigation}
        pathPrefix="block"
        path="rfq-eoi"
      >
        <Badge>Enterprise</Badge>
      </NavigationMenuLinkItem>
    </>
  );
};
