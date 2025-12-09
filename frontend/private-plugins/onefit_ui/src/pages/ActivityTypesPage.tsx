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
import { ActivityTypesList } from '~/modules/activity-type/components/ActivityTypesList';
import { CreateActivityTypeDialog } from '~/modules/activity-type/components/ActivityTypeDialog';
import { ActivityTypeFiltersComponent } from '~/modules/activity-type/components/ActivityTypeFilters';
import { ActivityTypeFilters } from '~/modules/activity-type/types/activityType';

export const ActivityTypesPage = () => {
  const [filters, setFilters] = useState<ActivityTypeFilters>({});

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
                  Activity Types
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
            <ActivityTypeFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />
            <CreateActivityTypeDialog />
          </div>
        </PageSubHeader>
        <ScrollArea className="flex-auto">
          <ActivityTypesList filters={filters} />
        </ScrollArea>
      </div>
    </PageContainer>
  );
};
