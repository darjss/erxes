import {
  IconBuilding,
  IconCoins,
  IconContract,
  IconInvoice,
  IconUser,
} from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const BlocktestNavigation = () => {
  return (
    <>
      <div className="relative">
        <span className="absolute bt:-top-6.5 bt:left-8 bg-sidebar font-semibold text-xs text-accent-foreground">
          Coverhill insurance modules
        </span>
      </div>
      <NavigationMenuLinkItem
        name="Contracts"
        icon={IconContract}
        pathPrefix="blocktest"
        path="contracts"
      />
      <NavigationMenuLinkItem
        name="Clients"
        icon={IconUser}
        pathPrefix="blocktest"
        path="clients"
      />
      <NavigationMenuLinkItem
        name="Markets"
        icon={IconBuilding}
        pathPrefix="blocktest"
        path="markets"
      />
      <NavigationMenuLinkItem
        name="Claims"
        icon={IconCoins}
        pathPrefix="blocktest"
        path="claims"
      />
      <NavigationMenuLinkItem
        name="Payments"
        icon={IconInvoice}
        pathPrefix="blocktest"
        path="payments"
      />
    </>
  );
};
