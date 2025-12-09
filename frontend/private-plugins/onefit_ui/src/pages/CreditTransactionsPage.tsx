import {
  IconActivity,
  IconSettings,
  IconCaretDownFilled,
} from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  PageContainer,
  PageSubHeader,
  Separator,
  ScrollArea,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CreditTransactionsList } from '~/modules/credit/components/CreditTransactionsList';
import { CreditTransactionFiltersComponent } from '~/modules/credit/components/CreditTransactionFilters';
import { CreateCreditTransactionDialog } from '~/modules/credit/components/CreateCreditTransactionDialog';
import { CreditTransactionFilters } from '~/modules/credit/types/credit';

export const CreditTransactionsPage = () => {
  const [filters, setFilters] = useState<CreditTransactionFilters>({});

  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/onefit">
                    <IconActivity />
                    OneFit
                  </Link>
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Button variant="ghost" disabled>
                  Credit Transactions
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <CreateCreditTransactionDialog />
          <Button variant="outline" asChild>
            <Link to="/settings/onefit">
              <IconSettings />
              Go to settings
            </Link>
          </Button>
          <Button>
            More <IconCaretDownFilled />
          </Button>
        </PageHeader.End>
      </PageHeader>
      <div className="flex flex-auto overflow-hidden flex-col">
        <PageSubHeader>
          <div className="flex items-center gap-2">
            <CreditTransactionFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </PageSubHeader>
        <ScrollArea className="flex-auto">
          <CreditTransactionsList filters={filters} />
        </ScrollArea>
      </div>
    </PageContainer>
  );
};

