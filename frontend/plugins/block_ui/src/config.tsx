import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconBlocks } from '@tabler/icons-react';

const BlockNavigation = lazy(() =>
  import('./modules/BlockNavigation').then((module) => ({
    default: module.BlockNavigation,
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
  },
};
