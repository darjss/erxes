import { useState } from 'react';
import { AgenciesBreadcrumb } from '@/agencies/components/AgenciesBreadcrumb';
import { AgenciesSubNav } from '@/agencies/components/AgenciesSubNav';
import { AdminListingFilterBar } from '@/agencies/listing/components/AdminListingFilter';
import { AdminListingGrid } from '@/agencies/listing/components/AdminListingGrid';
import { AdminListingFilter } from '@/agencies/listing/types';
import { PageContainer, PageSubHeader, ScrollArea, Separator } from 'erxes-ui';
import { PageHeader } from 'ui-modules';

export const AgencyListingPage = () => {
  const [filter, setFilter] = useState<AdminListingFilter>({});

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
        <AdminListingFilterBar filter={filter} onFilterChange={setFilter} />
      </PageSubHeader>
      <ScrollArea className="flex-auto">
        <AdminListingGrid filter={filter} />
      </ScrollArea>
    </PageContainer>
  );
};
