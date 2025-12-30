import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconActivity } from '@tabler/icons-react';

const OneFitNavigation = lazy(() =>
  import('./modules/OneFitNavigation').then((module) => ({
    default: module.OneFitNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'onefit',
  modules: [
    {
      name: 'onefit',
      icon: IconActivity,
      path: 'onefit',
      hasSettings: true,
    },
  ],
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
