import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

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

const OneFitMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/activity-types" element={<ActivityTypesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/membership-plans" element={<MembershipPlansPage />} />
        <Route
          path="/credit-transactions"
          element={<CreditTransactionsPage />}
        />
        <Route path="/customers" element={<OneFitCustomersPage />} />
        <Route path="/providers" element={<ProvidersPage />} />
      </Routes>
    </Suspense>
  );
};

export default OneFitMain;
