import {
  IconBuildingCommunity,
  IconCrane,
  IconListCheck,
} from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

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
      <NavigationMenuLinkItem
        name="Form"
        icon={IconListCheck}
        pathPrefix="blockadmin"
        path="form"
      />
    </>
  );
};
