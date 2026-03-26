import { useState } from 'react';
import { ProvidersList } from '~/modules/provider/components/ProvidersList';
import { CreateProviderDialog } from '~/modules/provider/components/ProviderDialog';
import { ProviderFilters } from '~/modules/provider/components/ProviderFilters';
import { ProviderFilters as ProviderFiltersType } from '~/modules/provider/types/provider';
import { MtoListPageLayout } from '~/components/MtoListPageLayout';

export function ProvidersPage() {
  const [filters, setFilters] = useState<ProviderFiltersType>({});

  return (
    <MtoListPageLayout
      pageName="Providers"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={ProviderFilters}
      createDialog={<CreateProviderDialog />}
      listComponent={ProvidersList}
    />
  );
}
