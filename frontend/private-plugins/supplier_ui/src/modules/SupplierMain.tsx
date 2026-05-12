import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { useIsCollective } from '~/hooks/useIsCollective';

const SupplierIndexPage = lazy(() =>
  import('~/pages/supplier/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const CollectiveIndexPage = lazy(() =>
  import('~/pages/collective/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const CollectiveSuppliersPage = lazy(() =>
  import('~/pages/collective/SuppliersPage').then((module) => ({
    default: module.SuppliersPage,
  })),
);

const SupplierMain = () => {
  const isCollective = useIsCollective();
  const ProfilePage = isCollective ? CollectiveIndexPage : SupplierIndexPage;

  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        {isCollective && (
          <Route path="suppliers" element={<CollectiveSuppliersPage />} />
        )}
      </Routes>
    </Suspense>
  );
};

export default SupplierMain;
