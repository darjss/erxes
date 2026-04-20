import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const IndexPage = lazy(() =>
  import('~/pages/supplier/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const SubmissionsPage = lazy(() =>
  import('~/pages/submissions/SubmissionsPage').then((module) => ({
    default: module.SubmissionsPage,
  })),
);

const SupplierMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="profile" element={<IndexPage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
      </Routes>
    </Suspense>
  );
};

export default SupplierMain;
