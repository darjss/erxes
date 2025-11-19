import { ScrollArea } from 'erxes-ui';

import { NewsBreadcrumb } from '~/modules/news/components/NewsBreadcrumb';
import { PageContainer } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { NewsDetailNameBreadcrumb } from '~/modules/news/components/NewsDetailName';
import { NewsDetailSidebar } from '~/modules/news/components/NewsDetailSidebar';
import { NewsDetailTabs } from '~/modules/news/components/NewsDetailTabs';
import { NewsDetailProfile } from '~/modules/news/components/NewsDetailProfile';

export const NewsDetail = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <NewsBreadcrumb>
            <NewsDetailNameBreadcrumb />
          </NewsBreadcrumb>
        </PageHeader.Start>
      </PageHeader>
      <div className="flex flex-auto overflow-hidden">
        <NewsDetailSidebar />
        <div className="flex flex-col flex-auto overflow-hidden">
          <NewsDetailProfile />
          <ScrollArea className="flex-auto bg-sidebar">
            <NewsDetailTabs />
            <ScrollArea.Bar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </PageContainer>
  );
};
