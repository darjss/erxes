import { useState } from 'react';
import { MtoListPageLayout } from '~/components/MtoListPageLayout';
import { RegistrationFilters } from '@/registration/components/RegistrationFilters';
import { RegistrationsList } from '@/registration/components/RegistrationsList';
import { RegistrationFilters as RegistrationFiltersType } from '@/registration/types/registrationFilters';

export function RegistrationsPage() {
  const [filters, setFilters] = useState<RegistrationFiltersType>({});

  return (
    <MtoListPageLayout
      pageName="Бүртгэлүүд"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={RegistrationFilters}
      listComponent={RegistrationsList}
    />
  );
}
