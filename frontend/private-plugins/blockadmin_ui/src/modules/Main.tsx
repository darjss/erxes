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

const DevelopersPage = lazy(() =>
  import('~/pages/DevelopersPage').then((module) => ({
    default: module.DevelopersPage,
  })),
);

const DeveloperDetail = lazy(() =>
  import('~/pages/DeveloperDetail').then((module) => ({
    default: module.DeveloperDetail,
  })),
);

const Main = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        <Route path="/developers" element={<DevelopersPage />} />
        <Route path="/developers/:id" element={<DeveloperDetail />} />

        <Route path="/stacking-plan" element={<StackingPlanPage />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
