import { PageContainer, ScrollArea, Separator } from 'erxes-ui';
import { CreateProject } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/CreateProject';
import { ProjectBreadcrumb } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/ProjectBreadcrumb';
import { Projects } from 'frontend/private-plugins/blockadmin_ui/src/modules/project/components/Projects';
import { PageHeader } from 'ui-modules';

export const ProjectsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <ProjectBreadcrumb />
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <CreateProject />
        </PageHeader.End>
      </PageHeader>
      <ScrollArea className="flex-auto">
        <Projects />
      </ScrollArea>
    </PageContainer>
  );
};
