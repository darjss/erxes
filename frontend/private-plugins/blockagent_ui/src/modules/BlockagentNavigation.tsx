import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconHomeSearch, IconId, IconUserHexagon } from '@tabler/icons-react';
import { AgencyPaths } from './blockagent/types/AgencyPaths';

export const BlockagentNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="agency profile"
        icon={IconId}
        pathPrefix="blockagent"
        path={AgencyPaths.AGENCY_PROFILE}
      />
      <NavigationMenuLinkItem
        name="profile"
        icon={IconUserHexagon}
        pathPrefix="blockagent"
        path={AgencyPaths.PROFILE}
      />
      <NavigationMenuLinkItem
        name="listing"
        icon={IconHomeSearch}
        pathPrefix="blockagent"
        path={AgencyPaths.LISTING}
      />
    </>
  );
};
