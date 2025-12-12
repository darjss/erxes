import { useState } from 'react';
import { ProvidersList } from '~/modules/provider/components/ProvidersList';
import { CreateProviderDialog } from '~/modules/provider/components/ProviderDialog';
import { ProviderFilters } from '~/modules/provider/components/ProviderFilters';
import { ProviderFilters as ProviderFiltersType } from '~/modules/provider/types/provider';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';

export function ProvidersPage() {
  const [filters, setFilters] = useState<ProviderFiltersType>({});

  return (
    <OneFitListPageLayout
      pageName="Providers"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={ProviderFilters}
      createDialog={<CreateProviderDialog />}
      listComponent={ProvidersList}
    />
  );
}
