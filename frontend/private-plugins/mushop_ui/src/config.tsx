import { IconBuildingStore, IconFileDescription } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';
import { IUIConfig } from 'erxes-ui';

const MushopNavigation = lazy(() =>
  import('@/MushopNavigation').then((module) => ({
    default: module.MushopNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'mushop',
  path: 'mushop',
  i18n: true,
  navigationGroup: {
    name: 'MuShop',
    icon: IconBuildingStore,
    content: () => (
      <Suspense fallback={<div />}>
        <MushopNavigation />
      </Suspense>
    ),
  },

  modules: [
    {
      name: 'MuShop',
      icon: IconBuildingStore,
      path: 'mushop',
    },
  ],

  widgets: {
    relationWidgets: [
      {
        name: 'membership_plan',
        icon: IconFileDescription,
      },
    ],
  },
};
