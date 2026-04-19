import { IconLibrary, IconSparkles } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const AgentNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="Ai assistant"
        icon={IconSparkles}
        path="agent"
        pathPrefix="agent"
      />
      <NavigationMenuLinkItem
        name="Agent Templates"
        icon={IconLibrary}
        path="templates"
        pathPrefix="agent"
      />
    </>
  );
};
