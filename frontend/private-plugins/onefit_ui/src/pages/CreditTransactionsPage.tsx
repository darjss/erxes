import { useState } from 'react';
import { Button } from 'erxes-ui';
import { IconBuilding } from '@tabler/icons-react';
import { CreditTransactionsList } from '~/modules/credit/components/CreditTransactionsList';
import { CreditTransactionFiltersComponent } from '~/modules/credit/components/CreditTransactionFilters';
import { CreateCreditTransactionDialog } from '~/modules/credit/components/CreateCreditTransactionDialog';
import { BulkCreditTransactionDialog } from '~/modules/credit/components/BulkCreditTransactionDialog';
import { CreditTransactionFilters } from '~/modules/credit/types/credit';
import { OneFitListPageLayout } from '~/components/OneFitListPageLayout';

export function CreditTransactionsPage() {
  const [filters, setFilters] = useState<CreditTransactionFilters>({});

  return (
    <OneFitListPageLayout
      pageName="Credit Transactions"
      filters={filters}
      onFiltersChange={setFilters}
      filtersComponent={CreditTransactionFiltersComponent}
      createDialog={<CreateCreditTransactionDialog />}
      createDialogInHeader={true}
      headerActions={
        <BulkCreditTransactionDialog
          trigger={
            <Button variant="outline" size="sm" disabled>
              <IconBuilding />
              Bulk credit (corporate)
            </Button>
          }
        />
      }
      listComponent={CreditTransactionsList}
    />
  );
}
