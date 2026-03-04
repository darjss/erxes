import { NavigationMenuLinkItem } from 'erxes-ui';
import { IconActivity, IconSettings } from '@tabler/icons-react';
import { useOneFitInstanceId } from '@/config/hooks/useOneFitInstanceId';
import { OneFitNavigation } from './OneFitNavigation';

export function OneFitNavigationWithGuard() {
  const { instanceId, loading } = useOneFitInstanceId();

  if (loading) {
    return (
      <NavigationMenuLinkItem
        name="OneFit"
        icon={IconActivity}
        pathPrefix="onefit"
        path=""
      />
    );
  }

  if (!instanceId || instanceId.trim() === '') {
    return (
      <>
        <NavigationMenuLinkItem
          name="Complete OneFit setup"
          icon={IconSettings}
          pathPrefix="settings"
          path="onefit"
        />
      </>
    );
  }

  return <OneFitNavigation />;
}
