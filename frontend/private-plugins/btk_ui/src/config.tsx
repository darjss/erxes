import { IUIConfig } from 'erxes-ui';
import { Suspense, lazy } from 'react';
import { IconBusinessplan } from '@tabler/icons-react';

const BtkNavigation = lazy(() =>
  import('./modules/BtkNavigation').then((module) => ({
    default: module.BtkNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'btk',
  modules: [
    {
      name: 'btk',
      icon: IconBusinessplan,
      path: 'btk',
      hasSettings: false,
    },
  ],
  navigationGroup: {
    name: 'btk',
    icon: IconBusinessplan,
    content: () => (
      <Suspense fallback={<div />}>
        <BtkNavigation />
      </Suspense>
    ),
  },
};
