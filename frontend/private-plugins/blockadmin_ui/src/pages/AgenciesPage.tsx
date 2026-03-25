import { Agencies } from '@/agencies/components/Agencies';
import { AgenciesBreadcrumb } from '@/agencies/components/AgenciesBreadcrumb';
import { AgenciesFilter } from '@/agencies/components/AgenciesFilter';
import { PageContainer, PageSubHeader, ScrollArea, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';

export const AgenciesPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <AgenciesBreadcrumb />
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>
      <PageSubHeader>
        <AgenciesFilter />
      </PageSubHeader>
      <ScrollArea className="flex-auto">
        <Agencies />
      </ScrollArea>
    </PageContainer>
  );
};
