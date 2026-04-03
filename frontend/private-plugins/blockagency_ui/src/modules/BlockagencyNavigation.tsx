import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconHomeSearch, IconId, IconUserHexagon } from '@tabler/icons-react';
import { AgencyPaths } from './types/AgencyPaths';
import { Can } from 'ui-modules';

export const BlockagencyNavigation = () => {
  return (
    <>
      <Can action="agencyRead">
        <NavigationMenuLinkItem
          name="agency profile"
          icon={IconId}
          pathPrefix="blockagency"
          path={AgencyPaths.AGENCY_PROFILE}
        />
      </Can>
      <Can action="memberView">
        <NavigationMenuLinkItem
          name="profile"
          icon={IconUserHexagon}
          pathPrefix="blockagency"
          path={AgencyPaths.PROFILE}
        />
      </Can>
      <NavigationMenuLinkItem
        name="listing"
        icon={IconHomeSearch}
        pathPrefix="blockagency"
        path={AgencyPaths.LISTING}
      />
    </>
  );
};
