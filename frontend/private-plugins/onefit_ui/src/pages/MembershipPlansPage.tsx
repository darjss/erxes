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
import { MembershipPlansList } from '~/modules/membership/components/MembershipPlansList';
import { CreateMembershipPlanDialog } from '~/modules/membership/components/CreateMembershipPlanDialog';
import { MembershipPlanFiltersComponent } from '~/modules/membership/components/MembershipPlanFilters';
import { MembershipPlanFilters } from '~/modules/membership/types/membership';

export const MembershipPlansPage = () => {
  const [filters, setFilters] = useState<MembershipPlanFilters>({});

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
                  Membership Plans
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
            <MembershipPlanFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
            <CreateMembershipPlanDialog />
          </div>
        </PageSubHeader>
        <ScrollArea className="flex-auto">
          <MembershipPlansList filters={filters} />
        </ScrollArea>
      </div>
    </PageContainer>
  );
};








