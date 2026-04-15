import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const IndexPage = lazy(() =>
  import('~/pages/supplier/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const InventoryPage = lazy(() =>
  import('~/pages/inventory/InventoryPage').then((module) => ({
    default: module.InventoryPage,
  })),
);

const SupplierMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="profile" element={<IndexPage />} />
        <Route path="inventory" element={<InventoryPage />} />
      </Routes>
    </Suspense>
  );
};

export default SupplierMain;
