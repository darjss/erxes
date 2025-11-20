import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import '../styles.css';

const NewsPage = lazy(() =>
  import('../pages/NewsPage').then((module) => ({
    default: module.NewsPage,
  })),
);

const NewsDetail = lazy(() =>
  import('../pages/NewsDetail').then((module) => ({
    default: module.NewsDetail,
  })),
);

const CompanyInfoPage = lazy(() =>
  import('../pages/CompanyInfoPage').then((module) => ({
    default: module.CompanyInfoPage,
  })),
);

const Main = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/company-info" element={<CompanyInfoPage />} />
      </Routes>
    </Suspense>
  );
};

export default Main;
