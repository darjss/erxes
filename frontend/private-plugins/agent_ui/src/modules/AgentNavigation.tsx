import { IconCode, IconSparkles } from '@tabler/icons-react';
import { NavigationMenuLinkItem } from 'erxes-ui';
import { LOCKED_COMPANY_BRAIN_MODULES } from '~/modules/company-brain/constants/lockedCompanyBrainModules';

export const AgentNavigation = () => {
  return (
    <>
      <NavigationMenuLinkItem
        name="AI Assistant"
        icon={IconSparkles}
        path="assistant"
        pathPrefix="agent"
      />
      <NavigationMenuLinkItem
        name="AI Agents"
        icon={IconCode}
        path="agents"
        pathPrefix="agent"
      />
      {LOCKED_COMPANY_BRAIN_MODULES.map((module) => (
        <NavigationMenuLinkItem
          key={module.slug}
          name={module.name}
          icon={module.icon}
          path={module.slug}
          pathPrefix="agent"
        />
      ))}
    </>
  );
};
