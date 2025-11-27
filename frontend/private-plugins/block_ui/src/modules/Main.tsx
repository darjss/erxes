import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import '../styles.css';

const ProjectsPage = lazy(() =>
  import('~/pages/ProjectsPage').then((module) => ({
    default: module.ProjectsPage,
  })),
);

const ProjectDetail = lazy(() =>
  import('~/pages/ProjectDetail').then((module) => ({
    default: module.ProjectDetail,
  })),
);

export const StackingPlanPage = lazy(() =>
  import('~/pages/StackingPlanPage').then((module) => ({
    default: module.StackingPlanPage,
  })),
);

const DeveloperInfoPage = lazy(() =>
  import('~/pages/DeveloperInfoPage').then((module) => ({
    default: module.DeveloperInfoPage,
  })),
);

const ContractsPage = lazy(() =>
  import('~/pages/ContractsPage').then((module) => ({
    default: module.ContractsPage,
  })),
);

const Main = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/stacking-plan" element={<StackingPlanPage />} />
        <Route path="/developer-info" element={<DeveloperInfoPage />} />
        <Route path="/bm" element={<ContractsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/finance-lease" element={<ContractsPage />} />
        <Route path="/invoices" element={<ContractsPage />} />
        <Route path="/rfq-eoi" element={<ContractsPage />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
