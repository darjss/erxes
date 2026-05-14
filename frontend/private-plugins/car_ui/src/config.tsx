import { IconCarSuv } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';
import { IUIConfig } from 'erxes-ui';

const MainNavigation = lazy(() =>
  import('./modules/MainNavigation').then((module) => ({
    default: module.MainNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'car',
  path: 'car',
  icon: IconCarSuv,
  navigationGroup: {
    name: 'car',
    icon: IconCarSuv,
    content: () => (
      <Suspense fallback={<div />}>
        <MainNavigation />
      </Suspense>
    ),
  },
  modules: [
    {
      name: 'car',
      icon: IconCarSuv,
      path: 'car',
      hasRelationWidget: true,
      hasSegmentConfigWidget: true,
    },
  ],
  widgets: {
    relationWidgets: [
      {
        name: 'car',
        icon: IconCarSuv,
      },
    ],
  },
};
