import { IconSandbox } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';
import { IUIConfig } from 'erxes-ui';

const CarSettingsNavigation = lazy(() =>
  import('@/CarSettingsNavigation').then((module) => ({
    default: module.CarSettingsNavigation,
  })),
);

const CarNavigation = lazy(() =>
  import('@/CarNavigation').then((module) => ({
    default: module.CarNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'car',
  path: 'car',
  settingsNavigation: () => (
    <Suspense fallback={<div />}>
      <CarSettingsNavigation />
    </Suspense>
  ),
  navigationGroup: {
    name: 'car',
    icon: IconSandbox,
    content: () => (
      <Suspense fallback={<div />}>
        <CarNavigation />
      </Suspense>
    ),
  },

  modules: [
    {
      name: 'car',
      icon: IconSandbox,
      path: 'car',
    },
  ],
};
