import { IconCoins, IconContract, IconInvoice } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const BlocktestNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Contracts"
        icon={IconContract}
        pathPrefix="blocktest"
        path="contracts"
      />
      <NavigationMenuLinkItem
        name="Payments"
        icon={IconInvoice}
        pathPrefix="blocktest"
        path="payments"
      />
      <NavigationMenuLinkItem
        name="Claims"
        icon={IconCoins}
        pathPrefix="blocktest"
        path="claims"
      />
    </>
  );
};
