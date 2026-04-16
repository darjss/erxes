import { IconPackages } from '@tabler/icons-react';
import { lazy, Suspense } from 'react';
import { IUIConfig } from 'erxes-ui';

const SupplierNavigation = lazy(() =>
  import('@/SupplierNavigation').then((module) => ({
    default: module.SupplierNavigation,
  })),
);

export const CONFIG: IUIConfig = {
  name: 'supplier',
  path: 'supplier',
  navigationGroup: {
    name: 'Supplier',
    icon: IconPackages,
    content: () => (
      <Suspense fallback={<div />}>
        <SupplierNavigation />
      </Suspense>
    ),
  },

  modules: [
    {
      name: 'Supplier',
      icon: IconPackages,
      path: 'supplier',
    },
  ],
};
