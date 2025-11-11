import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconBuildingCommunity, IconCrane } from '@tabler/icons-react';

export const BlockNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Developers"
        icon={IconCrane}
        pathPrefix="blockadmin"
        path="developers"
      />
      <NavigationMenuLinkItem
        name="Projects"
        icon={IconBuildingCommunity}
        pathPrefix="blockadmin"
        path="projects"
      />
    </>
  );
};
