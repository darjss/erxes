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

const BlockagencyMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path={AgencyPaths.AGENCY_PROFILE} element={<IndexPage />} />
        <Route path={AgencyPaths.LISTING} element={<ListingPage />}>
          <Route index element={<ListingIndexPage />} />
          <Route
            path={AgencyPaths.LISTING_DETAIL}
            element={<div>Listing Detail page</div>}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BlockagencyMain;
