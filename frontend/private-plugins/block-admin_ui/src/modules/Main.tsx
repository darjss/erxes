import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import '../styles.css';

const ProjectsPage = lazy(() =>
  import('frontend/private-plugins/blockadmin_ui/src/pages/ProjectsPage').then(
    (module) => ({
      default: module.ProjectsPage,
    }),
  ),
);

const ProjectDetail = lazy(() =>
  import('frontend/private-plugins/blockadmin_ui/src/pages/ProjectDetail').then(
    (module) => ({
      default: module.ProjectDetail,
    }),
  ),
);

export const StackingPlanPage = lazy(() =>
  import(
    'frontend/private-plugins/blockadmin_ui/src/pages/StackingPlanPage'
  ).then((module) => ({
    default: module.StackingPlanPage,
  })),
);

const DeveloperInfoPage = lazy(() =>
  import(
    'frontend/private-plugins/blockadmin_ui/src/pages/DeveloperInfoPage'
  ).then((module) => ({
    default: module.DeveloperInfoPage,
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
      </Routes>
    </Suspense>
  );
};

export default Main;
