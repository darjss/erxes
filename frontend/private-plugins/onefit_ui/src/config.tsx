import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconActivity } from '@tabler/icons-react';

const OneFitNavigation = lazy(() =>
  import('./modules/OneFitNavigation').then((module) => ({
    default: module.OneFitNavigation,
  })),
);
// const OnefitSettingsNavigation = lazy(() =>
//   import('@/OnefitSettingsNavigation').then((mod) => ({
//     default: mod.OnefitSettingsNavigation,
//   })),
// );
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
  settingsNavigation: () => (
    <Suspense fallback={<div />}>
      {/* <OperationSettingsNavigation /> */}
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
