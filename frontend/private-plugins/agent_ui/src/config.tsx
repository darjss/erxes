import { IUIConfig } from 'erxes-ui';
import { IconSparkles } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';

const AgentNavigation = lazy(() =>
  import('./modules/AgentNavigation').then((module) => ({
    default: module.AgentNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'agent',
  path: 'agent',
  navigationGroup: {
    name: 'ai assistant',
    icon: IconSparkles,
    content: () => (
      <Suspense fallback={<div />}>
        <AgentNavigation />
      </Suspense>
    ),
  },
  modules: [
    {
      name: 'ai assistand',
      icon: IconSparkles,
      path: 'agent/agent',
    },
    {
      name: 'templates',
      icon: IconSparkles,
      path: 'agent/templates',
    },
  ],
};
