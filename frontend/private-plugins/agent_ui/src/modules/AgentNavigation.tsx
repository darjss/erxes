import { IconSparkles } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const AgentNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="ai agent"
        icon={IconSparkles}
        path="agent"
      />
    </>
  );
};
