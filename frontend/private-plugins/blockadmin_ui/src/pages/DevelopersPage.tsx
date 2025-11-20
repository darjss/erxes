import { DevelopersBreadcrumb } from '@/developer/components/DeveloperBreadcrumb';
import { Developers } from '@/developer/components/Developers';
import { PageContainer, ScrollArea, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';

export const DevelopersPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <DevelopersBreadcrumb />
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>
      <ScrollArea className="flex-auto">
        <Developers />
      </ScrollArea>
    </PageContainer>
  );
};
