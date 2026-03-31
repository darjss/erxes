import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { AgencyPaths } from './blockagent/types/AgencyPaths';

const IndexPage = lazy(() =>
  import('~/pages/blockagent/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const ListingPage = lazy(() =>
  import('~/pages/blockagent/ListingPage').then((module) => ({
    default: module.ListingPage,
  })),
);

const ListingIndexPage = lazy(() =>
  import('~/pages/blockagent/ListingIndexPage').then((module) => ({
    default: module.ListingIndexPage,
  })),
);

const BlockagentMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path={AgencyPaths.PROFILE} element={<IndexPage />} />
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

export default BlockagentMain;
