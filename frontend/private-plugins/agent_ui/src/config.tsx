import { IconSandbox } from '@tabler/icons-react';
import { IUIConfig } from 'erxes-ui';
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
    name: 'agent',
    icon: IconSandbox,
    content: () => (
      <Suspense fallback={<div />}>
        <AgentNavigation />
      </Suspense>
    ),
  },
  modules: [
    {
      name: 'agent',
      icon: IconSandbox,
      path: 'agent',
    },
  ],
};
