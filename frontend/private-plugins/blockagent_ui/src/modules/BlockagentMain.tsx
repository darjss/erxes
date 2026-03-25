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

const BlockagentMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path={AgencyPaths.PROFILE} element={<IndexPage />} />
        <Route path={AgencyPaths.LISTING} element={<ListingPage />} />
      </Routes>
    </Suspense>
  );
};

export default BlockagentMain;
