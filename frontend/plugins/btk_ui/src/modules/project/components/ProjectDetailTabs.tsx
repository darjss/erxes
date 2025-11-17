import { PROJECT_TABS } from '@/project/constants/project';
import { useProjectDetail } from '@/project/hooks/useProjectDetail';
import { Spinner, useQueryState } from 'erxes-ui';
import { Suspense, lazy } from 'react';

const ProjectDetailGeneral = lazy(() =>
  import('./ProjectDetailGeneral').then((module) => ({
    default: module.ProjectDetailGeneral,
  })),
);

const ProjectDetailAmenities = lazy(() =>
  import('./ProjectDetailAmenities').then((module) => ({
    default: module.ProjectDetailAmenities,
  })),
);

const ProjectDetailMedia = lazy(() =>
  import('./ProjectDetailMedia').then((module) => ({
    default: module.ProjectDetailMedia,
  })),
);

const ProjectDetailDocument = lazy(() =>
  import('./ProjectDetailDocument').then((module) => ({
    default: module.ProjectDetailDocument,
  })),
);

const ProjectDetailSeo = lazy(() =>
  import('./ProjectDetailSeo').then((module) => ({
    default: module.ProjectDetailSeo,
  })),
);

const ProjectDetailPolicies = lazy(() =>
  import('./ProjectDetailPolicies').then((module) => ({
    default: module.ProjectDetailPolicies,
  })),
);

const ProjectDetailMembers = lazy(() =>
  import('./ProjectDetailMembers').then((module) => ({
    default: module.ProjectDetailMembers,
  })),
);

export const ProjectDetailTabs = () => {
  const [activeTab] = useQueryState('activeTab', {
    defaultValue: 'general',
  });
  const { loading } = useProjectDetail();

  if (loading) return null;

  return (
    <Suspense fallback={<Spinner containerClassName="py-32" />}>
      {activeTab === PROJECT_TABS.GENERAL && <ProjectDetailGeneral />}
      {activeTab === PROJECT_TABS.AMENITIES && <ProjectDetailAmenities />}
      {activeTab === PROJECT_TABS.MEMBERS && <ProjectDetailMembers />}
      {activeTab === PROJECT_TABS.MEDIA && <ProjectDetailMedia />}
      {activeTab === PROJECT_TABS.DOCUMENTS && <ProjectDetailDocument />}
      {activeTab === PROJECT_TABS.SEO && <ProjectDetailSeo />}
      {activeTab === PROJECT_TABS.POLICIES && <ProjectDetailPolicies />}
    </Suspense>
  );
};
