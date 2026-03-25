
import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconHomeSearch, IconId } from '@tabler/icons-react';
import { AgencyPaths } from './blockagent/types/AgencyPaths';

export const BlockagentNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="profile"
        icon={IconId}
        pathPrefix='blockagent'
        path={AgencyPaths.PROFILE}
      />
      <NavigationMenuLinkItem
        name="listing"
        icon={IconHomeSearch}
        pathPrefix='blockagent'
        path={AgencyPaths.LISTING}
      />
    </>
  );
};
