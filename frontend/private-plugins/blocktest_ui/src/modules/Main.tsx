import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import '../styles.css';

const ContractsPage = lazy(() =>
  import('~/pages/ContractsPage').then((module) => ({
    default: module.ContractsPage,
  })),
);

const ClientsPage = lazy(() =>
  import('~/pages/ClientsPage').then((module) => ({
    default: module.ClientsPage,
  })),
);

const blocktestMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
      </Routes>
    </Suspense>
  );
};

export default blocktestMain;
