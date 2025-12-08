import { IconShield } from '@tabler/icons-react';

import { IUIConfig } from 'erxes-ui';
import { lazy, Suspense } from 'react';

const BlocktestNavigation = lazy(() =>
  import('./modules/BlocktestNavigation').then((module) => ({
    default: module.BlocktestNavigation,
  })),
);
export const CONFIG: IUIConfig = {
  name: 'blocktest',
  icon: IconShield,
  modules: [
    {
      name: 'blocktest',
      icon: IconShield,
      path: 'blocktest',
      hasSettings: false,
      hasRelationWidget: false,
      hasFloatingWidget: true,
    },
  ],
  navigationGroup: {
    name: 'blocktest',
    icon: IconShield,
    content: () => (
      <Suspense fallback={<div />}>
        <BlocktestNavigation />
      </Suspense>
    ),
  },
};
