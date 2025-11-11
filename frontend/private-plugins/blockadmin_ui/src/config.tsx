import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconBlocks } from '@tabler/icons-react';

const BlockNavigation = lazy(() =>
  import('./modules/BlockAdminNavigation').then((module) => ({
    default: module.BlockNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'blockadmin',
  modules: [
    {
      name: 'blockadmin',
      icon: IconBlocks,
      path: 'blockadmin',
      hasSettings: false,
    },
  ],
  navigationGroup: {
    name: 'blockadmin',
    icon: IconBlocks,
    content: () => (
      <Suspense fallback={<div />}>
        <BlockNavigation />
      </Suspense>
    ),
  },
};
