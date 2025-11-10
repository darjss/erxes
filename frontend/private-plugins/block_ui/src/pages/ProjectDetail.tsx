import { ScrollArea } from 'erxes-ui';

import { ProjectBreadcrumb } from '@/project/components/ProjectBreadcrumb';
import { PageContainer } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { ProjectDetailNameBreadcrumb } from '@/project/components/ProjectDetailName';
import { ProjectDetailSidebar } from '@/project/components/ProjectDetailSidebar';
import { ProjectDetailTabs } from '@/project/components/ProjectDetailTabs';
import { ProjectDetailProfile } from '@/project/components/ProjectDetailProfile';

export const ProjectDetail = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <ProjectBreadcrumb>
            <ProjectDetailNameBreadcrumb />
          </ProjectBreadcrumb>
        </PageHeader.Start>
      </PageHeader>
      <div className="flex flex-auto overflow-hidden">
        <ProjectDetailSidebar />
        <div className="flex flex-col flex-auto overflow-hidden">
          <ProjectDetailProfile />
          <ScrollArea className="flex-auto bg-sidebar">
            <ProjectDetailTabs />
            <ScrollArea.Bar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </PageContainer>
  );
};
