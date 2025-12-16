import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconBlocks } from '@tabler/icons-react';

const BlockNavigation = lazy(() =>
  import('./modules/navigations/BlockNavigation').then((module) => ({
    default: module.BlockNavigation,
  })),
);

const BlockProjectsNavigation = lazy(() =>
  import('./modules/navigations/BlockProjectsNavigation').then((module) => ({
    default: module.BlockProjectsNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'block',
  modules: [
    {
      name: 'block',
      icon: IconBlocks,
      path: 'block',
      hasSettings: false,
      hasFloatingWidget: true,
    },
  ],
  navigationGroup: {
    name: 'block',
    icon: IconBlocks,
    content: () => (
      <Suspense fallback={<div />}>
        <BlockNavigation />
      </Suspense>
    ),
    subGroups: () => (
      <Suspense fallback={<div />}>
        <BlockProjectsNavigation />
      </Suspense>
    ),
  },
};
