import { useState } from 'react';
import { CreditTransactionsList } from '~/modules/credit/components/CreditTransactionsList';
import { CreditTransactionFiltersComponent } from '~/modules/credit/components/CreditTransactionFilters';
import { CreateCreditTransactionDialog } from '~/modules/credit/components/CreateCreditTransactionDialog';
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
      listComponent={CreditTransactionsList}
    />
  );
}
