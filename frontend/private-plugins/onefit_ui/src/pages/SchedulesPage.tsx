import {
  IconActivity,
  IconSettings,
  IconCaretDownFilled,
  IconCalendar,
} from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  PageContainer,
  PageSubHeader,
  Separator,
  ScrollArea,
  Tabs,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ScheduleTemplatesList } from '~/modules/schedule/components/ScheduleTemplatesList';
import { ScheduleTemplateFiltersComponent } from '~/modules/schedule/components/ScheduleTemplateFilters';
import { CreateScheduleTemplateDialog } from '~/modules/schedule/components/ScheduleTemplateDialog';
import { CopyPreviousMonthDialog } from '~/modules/schedule/components/CopyPreviousMonthDialog';
import { ScheduleTemplateFilters } from '~/modules/schedule/types/schedule';
import { ScheduleExceptionsList } from '~/modules/schedule/components/ScheduleExceptionsList';
import { ScheduleExceptionFiltersComponent } from '~/modules/schedule/components/ScheduleExceptionFilters';
import { CreateScheduleExceptionDialog } from '~/modules/schedule/components/CreateScheduleExceptionDialog';
import { ScheduleExceptionFilters } from '~/modules/schedule/types/schedule';

export const SchedulesPage = () => {
  const [templateFilters, setTemplateFilters] =
    useState<ScheduleTemplateFilters>({});
  const [exceptionFilters, setExceptionFilters] =
    useState<ScheduleExceptionFilters>({
      providerId: '',
    });
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

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
                  <IconCalendar />
                  Schedules
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
        <Tabs
          defaultValue="templates"
          className="flex flex-col flex-auto overflow-hidden"
        >
          <Tabs.List className="mx-4 mt-4">
            <Tabs.Trigger value="templates">Schedule Templates</Tabs.Trigger>
            <Tabs.Trigger value="exceptions">Schedule Exceptions</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            value="templates"
            className="flex flex-col flex-auto overflow-hidden"
          >
            <PageSubHeader>
              <div className="flex items-center gap-2">
                <ScheduleTemplateFiltersComponent
                  filters={templateFilters}
                  onFiltersChange={setTemplateFilters}
                />
                <CreateScheduleTemplateDialog />
                <Button
                  variant="outline"
                  onClick={() => setCopyDialogOpen(true)}
                >
                  Copy Previous Month
                </Button>
              </div>
            </PageSubHeader>
            <ScrollArea className="flex-auto">
              <ScheduleTemplatesList filters={templateFilters} />
            </ScrollArea>
          </Tabs.Content>
          <Tabs.Content
            value="exceptions"
            className="flex flex-col flex-auto overflow-hidden"
          >
            <PageSubHeader>
              <div className="flex items-center gap-2">
                <ScheduleExceptionFiltersComponent
                  filters={exceptionFilters}
                  onFiltersChange={setExceptionFilters}
                />
                <CreateScheduleExceptionDialog />
              </div>
            </PageSubHeader>
            <ScrollArea className="flex-auto">
              {exceptionFilters.providerId ? (
                <ScheduleExceptionsList filters={exceptionFilters} />
              ) : (
                <div className="m-4 p-4 text-center text-muted-foreground">
                  Please enter a Provider ID in the filters to view schedule
                  exceptions.
                </div>
              )}
            </ScrollArea>
          </Tabs.Content>
        </Tabs>
      </div>
      <CopyPreviousMonthDialog
        open={copyDialogOpen}
        onOpenChange={setCopyDialogOpen}
        onClose={() => setCopyDialogOpen(false)}
      />
    </PageContainer>
  );
};
