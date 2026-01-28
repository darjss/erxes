import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconActivity, IconUser } from '@tabler/icons-react';

const OneFitNavigation = lazy(() =>
  import('./modules/OneFitNavigation').then((module) => ({
    default: module.OneFitNavigation,
  })),
);

const OneFitSettingsNavigation = lazy(() =>
  import('./modules/OneFitSettingsNavigation').then((module) => ({
    default: module.OneFitSettingsNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'onefit',
  path: 'onefit',

  modules: [
    {
      name: 'onefit',
      icon: IconActivity,
      path: 'onefit',
    },
  ],
  widgets: {
    relationWidgets: [
      {
        name: 'onefitcustomer',
        icon: IconUser,
      },
    ],
  },
  settingsNavigation: () => (
    <Suspense fallback={<div />}>
      <OneFitSettingsNavigation />
    </Suspense>
  ),
  navigationGroup: {
    name: 'onefit',
    icon: IconActivity,
    content: () => (
      <Suspense fallback={<div />}>
        <OneFitNavigation />
      </Suspense>
    ),
  },
};
