import { PageContainer, ScrollArea, Separator } from 'erxes-ui';
import { ProjectBreadcrumb } from '@/project/components/ProjectBreadcrumb';
import { Projects } from '@/project/components/Projects';
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
      </PageHeader>
      <ScrollArea className="flex-auto">
        <Projects />
      </ScrollArea>
    </PageContainer>
  );
};
