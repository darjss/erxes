import { NavigationMenuLinkItem } from 'erxes-ui';
import {
  IconActivity,
  IconTags,
  IconBuildingStore,
  IconPhoto,
  IconClipboardList,
  IconList,
  IconForms,
} from '@tabler/icons-react';
import { useMtoMode } from './config/hooks/useMtoMode';

export const MtoNavigation = () => {
  const { isSlaveMode } = useMtoMode();

  return (
    <>
      <NavigationMenuLinkItem
        name="Mto"
        icon={IconActivity}
        pathPrefix="mto"
        path=""
      />
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Categories"
          icon={IconTags}
          pathPrefix="mto"
          path="categories"
        />
      )}
      <NavigationMenuLinkItem
        name="Providers"
        icon={IconBuildingStore}
        pathPrefix="mto"
        path="providers"
      />
      <NavigationMenuLinkItem
        name="Registration"
        icon={IconClipboardList}
        pathPrefix="mto"
        path="registration"
      />
      <NavigationMenuLinkItem
        name="Registrations"
        icon={IconList}
        pathPrefix="mto"
        path="registrations"
      />
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Registration Schemas"
          icon={IconForms}
          pathPrefix="mto"
          path="registration-schemas"
        />
      )}
      {!isSlaveMode && (
        <NavigationMenuLinkItem
          name="Banners"
          icon={IconPhoto}
          pathPrefix="mto"
          path="banners"
        />
      )}
    </>
  );
};
