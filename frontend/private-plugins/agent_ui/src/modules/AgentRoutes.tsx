import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const IndexPage = lazy(() =>
  import('~/pages/agent/IndexPage').then((module) => ({
    default: module.IndexPage,
  })),
);

const AgentTemplatesIndexPage = lazy(() =>
  import('~/pages/agent-templates/IndexPage').then((module) => ({
    default: module.AgentTemplatesIndexPage,
  })),
);

const AgentTemplateDetailPage = lazy(() =>
  import('~/pages/agent-templates/DetailPage').then((module) => ({
    default: module.AgentTemplateDetailPage,
  })),
);

const AgentMain = () => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route path="agent" element={<IndexPage />} />
        <Route path="templates" element={<AgentTemplatesIndexPage />} />
        <Route path="templates/:id" element={<AgentTemplateDetailPage />} />
      </Routes>
    </Suspense>
  );
};

export default AgentMain;
