import { NEWS_TABS } from '~/modules/news/constants/news';
import { useNewsDetail } from '~/modules/news/hooks/useNewsDetail';
import { Spinner, useQueryState } from 'erxes-ui';
import { Suspense, lazy } from 'react';

const NewsDetailGeneral = lazy(() =>
  import('./NewsDetailGeneral').then((module) => ({
    default: module.NewsDetailGeneral,
  })),
);

const NewsDetailAmenities = lazy(() =>
  import('./NewsDetailAmenities').then((module) => ({
    default: module.NewsDetailAmenities,
  })),
);

const NewsDetailMedia = lazy(() =>
  import('./NewsDetailMedia').then((module) => ({
    default: module.NewsDetailMedia,
  })),
);

const NewsDetailDocument = lazy(() =>
  import('./NewsDetailDocument').then((module) => ({
    default: module.NewsDetailDocument,
  })),
);

const NewsDetailSeo = lazy(() =>
  import('./NewsDetailSeo').then((module) => ({
    default: module.NewsDetailSeo,
  })),
);

const NewsDetailPolicies = lazy(() =>
  import('./NewsDetailPolicies').then((module) => ({
    default: module.NewsDetailPolicies,
  })),
);

const NewsDetailMembers = lazy(() =>
  import('./NewsDetailMembers').then((module) => ({
    default: module.NewsDetailMembers,
  })),
);

export const NewsDetailTabs = () => {
  const [activeTab] = useQueryState('activeTab', {
    defaultValue: 'general',
  });
  const { loading } = useNewsDetail();

  if (loading) return null;

  return (
    <Suspense fallback={<Spinner containerClassName="py-32" />}>
      {activeTab === NEWS_TABS.GENERAL && <NewsDetailGeneral />}
      {activeTab === NEWS_TABS.AMENITIES && <NewsDetailAmenities />}
      {activeTab === NEWS_TABS.MEMBERS && <NewsDetailMembers />}
      {activeTab === NEWS_TABS.MEDIA && <NewsDetailMedia />}
      {activeTab === NEWS_TABS.DOCUMENTS && <NewsDetailDocument />}
      {activeTab === NEWS_TABS.SEO && <NewsDetailSeo />}
      {activeTab === NEWS_TABS.POLICIES && <NewsDetailPolicies />}
    </Suspense>
  );
};
