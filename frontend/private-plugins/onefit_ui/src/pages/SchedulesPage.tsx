import { IconCalendar } from '@tabler/icons-react';
import { PageSubHeader, ScrollArea, Tabs, Button } from 'erxes-ui';
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
import { OneFitPageLayout } from '~/components/OneFitPageLayout';

export function SchedulesPage() {
  const [templateFilters, setTemplateFilters] =
    useState<ScheduleTemplateFilters>({});
  const [exceptionFilters, setExceptionFilters] =
    useState<ScheduleExceptionFilters>({
      providerId: '',
    });
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

  return (
    <OneFitPageLayout pageName="Schedules" pageIcon={<IconCalendar />}>
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
    </OneFitPageLayout>
  );
}
