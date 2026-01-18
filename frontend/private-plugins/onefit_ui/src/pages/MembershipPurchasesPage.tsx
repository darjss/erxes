import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';
import { CreateMembershipPurchaseDialog } from '~/modules/membership-purchase/components/CreateMembershipPurchaseDialog';
import { MembershipPurchaseFiltersComponent } from '~/modules/membership-purchase/components/MembershipPurchaseFilters';
import { MembershipPurchasesList } from '~/modules/membership-purchase/components/MembershipPurchasesList';
import { MembershipPurchaseFilters } from '~/modules/membership-purchase/types/membershipPurchase';

export function MembershipPurchasesPage() {
  const [filters, setFilters] = useState<MembershipPurchaseFilters>({});

  return (
    <OneFitListPageLayout
      pageName="Membership Purchases"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={MembershipPurchaseFiltersComponent}
      createDialog={
        <CreateMembershipPurchaseDialog
          trigger={
            <Button>
              <IconPlus />
              Create purchase
            </Button>
          }
        />
      }
      createDialogInHeader={true}
      listComponent={MembershipPurchasesList}
    />
  );
}

