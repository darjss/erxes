import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
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

const SubmissionsPage = lazy(() =>
  import('~/pages/SubmissionsPage').then((module) => ({
    default: module.SubmissionsPage,
  })),
);

const AgenciesPage = lazy(() =>
  import('~/pages/AgenciesPage').then((module) => ({
    default: module.AgenciesPage,
  })),
);

const AgencyDetailPage = lazy(() =>
  import('~/pages/AgencyDetailPage').then((module) => ({
    default: module.AgencyDetailPage,
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

        <Route path="/agencies" element={<AgenciesPage />} />
        <Route path="/agencies/:id" element={<AgencyDetailPage />} />

        <Route path="/form">
          <Route index element={<Navigate to="submissions" replace />} />
          <Route path="submissions">
            <Route index element={<Navigate to="1" replace />} />
            <Route path=":id" element={<SubmissionsPage />} />
          </Route>
        </Route>

        <Route path="/stacking-plan" element={<StackingPlanPage />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
