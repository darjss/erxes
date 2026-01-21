import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { useOneFitMode } from './config/hooks/useOneFitMode';

const IndexPage = lazy(() =>
  import('~/pages/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const BookingsPage = lazy(() =>
  import('~/pages/BookingsPage').then((module) => ({
    default: module.BookingsPage,
  })),
);

const SchedulesPage = lazy(() =>
  import('~/pages/SchedulesPage').then((module) => ({
    default: module.SchedulesPage,
  })),
);

const ActivityTypesPage = lazy(() =>
  import('~/pages/ActivityTypesPage').then((module) => ({
    default: module.ActivityTypesPage,
  })),
);

const CategoriesPage = lazy(() =>
  import('~/pages/CategoriesPage').then((module) => ({
    default: module.CategoriesPage,
  })),
);

const MembershipPlansPage = lazy(() =>
  import('~/pages/MembershipPlansPage').then((module) => ({
    default: module.MembershipPlansPage,
  })),
);

const CreditTransactionsPage = lazy(() =>
  import('~/pages/CreditTransactionsPage').then((module) => ({
    default: module.CreditTransactionsPage,
  })),
);

const MembershipPurchasesPage = lazy(() =>
  import('~/pages/MembershipPurchasesPage').then((module) => ({
    default: module.MembershipPurchasesPage,
  })),
);

const OneFitCustomersPage = lazy(() =>
  import('~/pages/OneFitCustomersPage').then((module) => ({
    default: module.OneFitCustomersPage,
  })),
);

const ProvidersPage = lazy(() =>
  import('~/pages/ProvidersPage').then((module) => ({
    default: module.ProvidersPage,
  })),
);

const BannersPage = lazy(() =>
  import('~/pages/BannersPage').then((module) => ({
    default: module.BannersPage,
  })),
);

const OneFitMain = () => {
  const { isSlaveMode } = useOneFitMode();

  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/activity-types" element={<ActivityTypesPage />} />
        {!isSlaveMode && (
          <Route path="/categories" element={<CategoriesPage />} />
        )}
        {!isSlaveMode && (
          <Route path="/membership-plans" element={<MembershipPlansPage />} />
        )}
        {!isSlaveMode && (
          <Route
            path="/credit-transactions"
            element={<CreditTransactionsPage />}
          />
        )}
        {!isSlaveMode && (
          <Route
            path="/membership-purchases"
            element={<MembershipPurchasesPage />}
          />
        )}
        {!isSlaveMode && (
          <Route path="/customers" element={<OneFitCustomersPage />} />
        )}
        <Route path="/providers" element={<ProvidersPage />} />
        {!isSlaveMode && <Route path="/banners" element={<BannersPage />} />}
      </Routes>
    </Suspense>
  );
};

export default OneFitMain;
