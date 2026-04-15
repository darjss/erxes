import { IconSparkles } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';

export const AgentNavigation = () => {
  return (
    <NavigationMenuLinkItem
      name="Ai assistant"
      icon={IconSparkles}
      path="agent"
    />
  );
};
