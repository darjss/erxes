import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconHomeSearch, IconId, IconUserHexagon } from '@tabler/icons-react';
import { AgencyPaths } from './types/AgencyPaths';

export const BlockagencyNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="agency profile"
        icon={IconId}
        pathPrefix="blockagency"
        path={AgencyPaths.AGENCY_PROFILE}
      />
      <NavigationMenuLinkItem
        name="profile"
        icon={IconUserHexagon}
        pathPrefix="blockagency"
        path={AgencyPaths.PROFILE}
      />
      <NavigationMenuLinkItem
        name="listing"
        icon={IconHomeSearch}
        pathPrefix="blockagency"
        path={AgencyPaths.LISTING}
      />
    </>
  );
};
