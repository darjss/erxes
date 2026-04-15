import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { AgencyPaths } from './types/AgencyPaths';

const IndexPage = lazy(() =>
  import('~/pages/blockagency/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ListingPage = lazy(() =>
  import('~/pages/blockagency/ListingPage').then((module) => ({
    default: module.ListingPage,
  })),
);

const ListingIndexPage = lazy(() =>
  import('~/pages/blockagency/ListingIndexPage').then((module) => ({
    default: module.ListingIndexPage,
  })),
);

const MemberIndexPage = lazy(() =>
  import('~/pages/blockagency/MemberIndexPage').then((module) => ({
    default: module.MemberIndexPage,
  })),
);

const UnitPage = lazy(() =>
  import('~/pages/blockagency/UnitPage').then((module) => ({
    default: module.UnitPage,
  })),
);

const UnitIndexPage = lazy(() =>
  import('~/pages/blockagency/UnitIndexPage').then((module) => ({
    default: module.UnitIndexPage,
  })),
);

const DashboardIndexPage = lazy(() =>
  import('~/pages/blockagency/DashboardIndexPage').then((module) => ({
    default: module.DashboardIndexPage,
  })),
);

const BlockagencyMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path={AgencyPaths.AGENCY_PROFILE} element={<IndexPage />} />
        <Route
          path={AgencyPaths.AGENCY_DASHBOARD}
          element={<DashboardIndexPage />}
        />
        <Route path={AgencyPaths.LISTING} element={<ListingPage />}>
          <Route index element={<ListingIndexPage />} />
          <Route
            path={AgencyPaths.LISTING_DETAIL}
            element={<div>Listing Detail page</div>}
          />
        </Route>
        <Route path={AgencyPaths.PROFILE} element={<MemberIndexPage />} />
        <Route path={AgencyPaths.UNITS} element={<UnitPage />}>
          <Route index element={<UnitIndexPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BlockagencyMain;
