import { IUIConfig } from 'erxes-ui';
import { IconCode, IconSparkles } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';
import { LOCKED_COMPANY_BRAIN_MODULES } from '~/modules/company-brain/constants/lockedCompanyBrainModules';

const AgentNavigation = lazy(() =>
  import('./modules/AgentNavigation').then((module) => ({
    default: module.AgentNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'agent',
  path: 'agent',
  navigationGroup: {
    name: 'Company Brain',
    icon: IconSparkles,
    content: () => (
      <Suspense fallback={<div />}>
        <AgentNavigation />
      </Suspense>
    ),
  },
  modules: [
    {
      name: 'AI Assistant',
      icon: IconSparkles,
      path: 'agent/assistant',
    },
    {
      name: 'AI Agents',
      icon: IconCode,
      path: 'agent/agents',
    },
    ...LOCKED_COMPANY_BRAIN_MODULES.map((module) => ({
      name: module.name,
      icon: module.icon,
      path: `agent/${module.slug}`,
    })),
  ],
};
