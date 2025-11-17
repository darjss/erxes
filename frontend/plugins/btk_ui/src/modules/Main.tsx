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

const CompanyInfoPage = lazy(() =>
  import('~/pages/CompanyInfoPage').then((module) => ({
    default: module.CompanyInfoPage,
  })),
);

const Main = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/company-info" element={<CompanyInfoPage />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
