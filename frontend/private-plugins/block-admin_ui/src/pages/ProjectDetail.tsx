import { ScrollArea } from 'erxes-ui';

import { PageContainer } from 'erxes-ui';
import { ProjectBreadcrumb } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectBreadcrumb';
import { ProjectDetailNameBreadcrumb } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectDetailName';
import { ProjectDetailProfile } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectDetailProfile';
import { ProjectDetailSidebar } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectDetailSidebar';
import { ProjectDetailTabs } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectDetailTabs';
import { PageHeader } from 'ui-modules';

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
