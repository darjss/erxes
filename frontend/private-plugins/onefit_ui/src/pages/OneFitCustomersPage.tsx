import {
  IconActivity,
  IconSettings,
  IconCaretDownFilled,
  IconUsers,
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
import { OneFitCustomersList } from '~/modules/onefitCustomer/components/OneFitCustomersList';
import { OneFitCustomerFiltersComponent } from '~/modules/onefitCustomer/components/OneFitCustomerFilters';
import { OneFitCustomerFilters } from '~/modules/onefitCustomer/types/onefitCustomer';

export const OneFitCustomersPage = () => {
  const [filters, setFilters] = useState<OneFitCustomerFilters>({});

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
                  <IconUsers />
                  Customers
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
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
            <OneFitCustomerFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </PageSubHeader>

        <OneFitCustomersList filters={filters} />
      </div>
    </PageContainer>
  );
};
