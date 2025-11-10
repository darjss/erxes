import { PageContainer, Separator, ScrollArea } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { CreateProject } from '@/project/components/CreateProject';
import { Projects } from '@/project/components/Projects';
import { ProjectBreadcrumb } from '@/project/components/ProjectBreadcrumb';

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
