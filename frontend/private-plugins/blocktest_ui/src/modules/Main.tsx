import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import '../styles.css';

const ContractsPage = lazy(() =>
  import('~/pages/ContractsPage').then((module) => ({
    default: module.ContractsPage,
  })),
);

const blocktestMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/contracts" element={<ContractsPage />} />
      </Routes>
    </Suspense>
  );
};

export default blocktestMain;
