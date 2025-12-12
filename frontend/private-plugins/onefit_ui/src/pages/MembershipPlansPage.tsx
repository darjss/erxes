import { useState } from 'react';
import { MembershipPlansList } from '~/modules/membership/components/MembershipPlansList';
import { CreateMembershipPlanDialog } from '~/modules/membership/components/CreateMembershipPlanDialog';
import { MembershipPlanFiltersComponent } from '~/modules/membership/components/MembershipPlanFilters';
import { MembershipPlanFilters } from '~/modules/membership/types/membership';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';

export function MembershipPlansPage() {
  const [filters, setFilters] = useState<MembershipPlanFilters>({});

  return (
    <OneFitListPageLayout
      pageName="Membership Plans"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={MembershipPlanFiltersComponent}
      createDialog={<CreateMembershipPlanDialog />}
      listComponent={MembershipPlansList}
    />
  );
}
