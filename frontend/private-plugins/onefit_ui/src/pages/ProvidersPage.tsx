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
import { ProvidersList } from '~/modules/provider/components/ProvidersList';
import { CreateProviderDialog } from '~/modules/provider/components/ProviderDialog';
import { ProviderFilters } from '~/modules/provider/components/ProviderFilters';
import { ProviderFilters as ProviderFiltersType } from '~/modules/provider/types/provider';

export const ProvidersPage = () => {
  const [filters, setFilters] = useState<ProviderFiltersType>({});

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
                  Providers
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
            <ProviderFilters filters={filters} onFiltersChange={setFilters} />
            <CreateProviderDialog />
          </div>
        </PageSubHeader>
        <ScrollArea className="flex-auto">
          <ProvidersList filters={filters} />
        </ScrollArea>
      </div>
    </PageContainer>
  );
};
