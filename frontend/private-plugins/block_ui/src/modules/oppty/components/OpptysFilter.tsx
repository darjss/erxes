import {
  IconSearch,
  IconUser,
  IconFlag,
  IconCalendarClock,
  IconCalendarTime,
  IconPhone,
} from '@tabler/icons-react';

import {
  Combobox,
  Command,
  Filter,
  useMultiQueryState,
} from 'erxes-ui';
import { SelectMember } from 'ui-modules';
import { SelectOpptyPriority } from './SelectPriority';
import { SelectCustomerSource } from './SelectCustomerSource';

const OpptysFilterPopover = () => {
  const [queries] = useMultiQueryState<{
    searchValue: string;
    assignedUserId: string;
    priority: string;
    customerSource: string;
    startDate: string;
    targetDate: string;
  }>([
    'searchValue',
    'assignedUserId',
    'priority',
    'customerSource',
    'startDate',
    'targetDate',
  ]);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <>
      <Filter.Popover>
        <Filter.Trigger isFiltered={hasFilters} />
        <Combobox.Content>
          <Filter.View>
            <Command>
              <Filter.CommandInput
                placeholder="Filter"
                variant="secondary"
                className="bg-background"
              />
              <Command.List className="p-1">
                <Filter.Item value="searchValue" inDialog>
                  <IconSearch />
                  Search
                </Filter.Item>
                <Filter.Item value="assignedUserId">
                  <IconUser />
                  Assignee
                </Filter.Item>
                <Filter.Item value="priority">
                  <IconFlag />
                  Priority
                </Filter.Item>
                <Filter.Item value="customerSource">
                  <IconPhone />
                  Customer Source
                </Filter.Item>
                <Command.Separator className="my-1" />
                <Filter.Item value="startDate">
                  <IconCalendarClock />
                  Start Date
                </Filter.Item>
                <Filter.Item value="targetDate">
                  <IconCalendarTime />
                  Target Date
                </Filter.Item>
              </Command.List>
            </Command>
          </Filter.View>
          <SelectMember.FilterView queryKey="assignedUserId" />
          <SelectOpptyPriority.FilterView />
          <SelectCustomerSource.FilterView />
          <Filter.View filterKey="startDate">
            <Filter.DateView filterKey="startDate" />
          </Filter.View>
          <Filter.View filterKey="targetDate">
            <Filter.DateView filterKey="targetDate" />
          </Filter.View>
        </Combobox.Content>
      </Filter.Popover>
      <Filter.Dialog>
        <Filter.View filterKey="searchValue" inDialog>
          <Filter.DialogStringView filterKey="searchValue" />
        </Filter.View>
      </Filter.Dialog>
    </>
  );
};

export const OpptysFilter = () => {
  return (
    <Filter id="opptys-filter">
      <Filter.Bar>
        <OpptysFilterPopover />
        <Filter.BarItem queryKey="searchValue">
          <Filter.BarName>
            <IconSearch />
            Search
          </Filter.BarName>
          <Filter.BarButton filterKey="searchValue" inDialog>
            Search
          </Filter.BarButton>
        </Filter.BarItem>
        <SelectMember.FilterBar queryKey="assignedUserId" />
        <Filter.BarItem queryKey="priority">
          <Filter.BarName>
            <IconFlag />
            Priority
          </Filter.BarName>
          <SelectOpptyPriority.FilterBar />
        </Filter.BarItem>
        <Filter.BarItem queryKey="customerSource">
          <Filter.BarName>
            <IconPhone />
            Source
          </Filter.BarName>
          <SelectCustomerSource.FilterBar />
        </Filter.BarItem>
        <Filter.BarItem queryKey="startDate">
          <Filter.BarName>
            <IconCalendarClock />
            Start Date
          </Filter.BarName>
          <Filter.Date filterKey="startDate" />
        </Filter.BarItem>
        <Filter.BarItem queryKey="targetDate">
          <Filter.BarName>
            <IconCalendarTime />
            Target Date
          </Filter.BarName>
          <Filter.Date filterKey="targetDate" />
        </Filter.BarItem>
      </Filter.Bar>
    </Filter>
  );
};
