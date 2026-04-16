import { useState } from 'react';
import { Agencies } from '@/agencies/components/Agencies';
import { AgenciesBreadcrumb } from '@/agencies/components/AgenciesBreadcrumb';
import { AgenciesFilter } from '@/agencies/components/AgenciesFilter';
import { AgenciesSubNav } from '@/agencies/components/AgenciesSubNav';
import { AgenciesFilterVars } from '@/agencies/hooks/useAgencies';
import { PageContainer, PageSubHeader, ScrollArea, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';

export const AgenciesPage = () => {
  const [filter, setFilter] = useState<AgenciesFilterVars>({});

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <AgenciesBreadcrumb />
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>
      <AgenciesSubNav />
      <PageSubHeader>
        <AgenciesFilter filter={filter} onFilterChange={setFilter} />
      </PageSubHeader>
      <ScrollArea className="flex-auto">
        <Agencies filter={filter} />
      </ScrollArea>
    </PageContainer>
  );
};
