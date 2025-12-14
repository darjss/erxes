import {
  IconBrandStackshare,
  IconBuilding,
  IconCalendarEvent,
  IconCheck,
  IconLabel,
  IconMapPin,
  IconNumber,
  IconUser,
} from '@tabler/icons-react';
import {
  Combobox,
  Command,
  Filter,
  Popover,
  useFilterContext,
  useMultiQueryState,
  useQueryState,
} from 'erxes-ui';
import { BlockTestHotKeyScope } from '~/modules/types';
import {
  CLIENT_BUSINESS_MAIN_TYPE_OPTIONS,
  CLIENT_LEAD_SOURCE_OPTIONS,
  CLIENT_STATUS_OPTIONS,
  CLIENT_TYPE_OPTIONS,
} from '../constants/clientTypes';
import { SelectMember } from 'ui-modules';
import { useState } from 'react';

export const ClientsFilter = () => {
  const [queries, setQueries] = useMultiQueryState(CLIENT_FILTER_QUERY_KEYS);

  const hasFilters = Object.values(queries || {}).some(
    (value) => value !== null,
  );

  return (
    <Filter id="clients-filter">
      <Filter.Bar>
        {CLIENT_FILTERS.map((filter) => {
          if (filter.type === 'select') {
            return (
              <ClientsSelectFilterBar
                key={filter.filterKey}
                filterKey={filter.filterKey}
                selectOptions={filter.selectOptions || []}
                icon={<filter.icon />}
                fieldLabel={filter.label}
              />
            );
          }

          if (filter.type === 'relation') {
            return filter.filterBar;
          }

          if (filter.type === 'text') {
            return (
              <Filter.BarItem queryKey={filter.filterKey}>
                <Filter.BarName>
                  <filter.icon />
                  {filter.label}
                </Filter.BarName>
                <Filter.BarButton filterKey={filter.filterKey}>
                  {queries[filter.filterKey as keyof typeof queries] as string}
                </Filter.BarButton>
              </Filter.BarItem>
            );
          }

          return null;
        })}
        <Filter.Popover scope={BlockTestHotKeyScope.ClientsPage}>
          <Filter.Trigger isFiltered={hasFilters} />
          <Combobox.Content>
            <Filter.View>
              <Command>
                <Filter.CommandInput
                  placeholder="Filter"
                  variant="secondary"
                  className="bg-background"
                />
                <Command.List className="p-1 max-h-none">
                  {CLIENT_FILTERS.map((filter) => (
                    <Filter.Item
                      key={filter.filterKey}
                      value={filter.filterKey}
                      inDialog={filter.type === 'text'}
                    >
                      <filter.icon />
                      {filter.label}
                    </Filter.Item>
                  ))}
                </Command.List>
              </Command>
            </Filter.View>
            {CLIENT_FILTERS.map((filter) => {
              if (filter.type === 'select') {
                return (
                  <ClientsSelectFilterView
                    key={filter.filterKey}
                    filterKey={filter.filterKey}
                    selectOptions={filter.selectOptions || []}
                    fieldLabel={filter.label}
                  />
                );
              }
              if (filter.type === 'relation') {
                return filter.filterView;
              }
              return null;
            })}
          </Combobox.Content>
        </Filter.Popover>
        <Filter.Dialog>
          {CLIENT_FILTERS.map((filter) => {
            if (filter.type === 'text') {
              return (
                <Filter.View filterKey={filter.filterKey} inDialog>
                  <Filter.DialogStringView
                    filterKey={filter.filterKey}
                    label={filter.label}
                  />
                </Filter.View>
              );
            }
            return null;
          })}
        </Filter.Dialog>
      </Filter.Bar>
    </Filter>
  );
};

export const ClientsSelectFilterView = ({
  filterKey,
  selectOptions,
  fieldLabel,
}: {
  filterKey: string;
  selectOptions: { value: string; label: string }[];
  fieldLabel: string;
}) => {
  const [value, setValue] = useQueryState<string>(filterKey);
  const { resetFilterState } = useFilterContext();
  return (
    <Filter.View filterKey={filterKey}>
      <ClientsSelectContent
        fieldLabel={fieldLabel}
        selectOptions={selectOptions}
        onSelect={(value) => {
          setValue(value);
          resetFilterState();
        }}
        selected={value || ''}
      />
    </Filter.View>
  );
};

export const ClientsSelectContent = ({
  selectOptions,
  onSelect,
  selected,
  fieldLabel,
}: {
  selectOptions: { value: string; label: string }[];
  onSelect: (value: string) => void;
  selected: string;
  fieldLabel: string;
}) => {
  return (
    <Command>
      <Command.Input
        placeholder={`Search ${fieldLabel}...`}
        variant="secondary"
        className="bg-background"
        focusOnMount
      />
      <Command.List>
        {selectOptions.map((option) => (
          <Command.Item
            key={option.value}
            value={option.value}
            onSelect={() => onSelect(option.value)}
          >
            {option.label}
            <Combobox.Check checked={selected === option.value} />
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  );
};

export const ClientsSelectFilterBar = ({
  filterKey,
  selectOptions,
  icon,
  fieldLabel,
}: {
  filterKey: string;
  selectOptions: { value: string; label: string }[];
  icon: React.ReactNode;
  fieldLabel: string;
}) => {
  const [_value, setValue] = useQueryState<string>(filterKey);
  const { resetFilterState } = useFilterContext();
  const [open, setOpen] = useState(false);

  const value = String(_value);

  return (
    <Filter.BarItem queryKey={filterKey}>
      <Filter.BarName>
        {icon}
        {fieldLabel}
      </Filter.BarName>
      <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <Filter.BarButton>
            <Combobox.Value
              placeholder={`Search ${fieldLabel}...`}
              value={
                value
                  ? selectOptions.find((option) => option.value === value)
                      ?.label
                  : undefined
              }
            />
          </Filter.BarButton>
        </Popover.Trigger>
        <Combobox.Content>
          <ClientsSelectContent
            fieldLabel={fieldLabel}
            selectOptions={selectOptions}
            onSelect={(value) => {
              setValue(value);
              resetFilterState();
            }}
            selected={value || ''}
          />
        </Combobox.Content>
      </Popover>
    </Filter.BarItem>
  );
};

export const CLIENT_FILTERS = [
  {
    filterKey: 'business_type',
    label: 'Business Type',
    icon: IconBuilding,
    type: 'select',
    selectOptions: CLIENT_BUSINESS_MAIN_TYPE_OPTIONS,
  },
  {
    filterKey: 'business_category',
    label: 'Business Category',
    icon: IconBuilding,
    type: 'text',
  },
  {
    filterKey: 'client_type',
    label: 'Client Type',
    icon: IconUser,
    type: 'select',
    selectOptions: CLIENT_TYPE_OPTIONS,
  },
  {
    filterKey: 'cvh_broker',
    label: 'CVH Broker',
    icon: IconUser,
    type: 'relation',
    filterView: <SelectMember.FilterView queryKey="cvh_broker" />,
    filterBar: <SelectMember.FilterBar queryKey="cvh_broker" />,
  },
  {
    filterKey: 'isActive',
    label: 'Active',
    icon: IconCheck,
    type: 'select',
    selectOptions: [
      { value: 'true', label: 'Active' },
      { value: 'false', label: 'Inactive' },
    ],
  },
  {
    filterKey: 'lead_source',
    label: 'Lead Source',
    icon: IconBrandStackshare,
    type: 'select',
    selectOptions: CLIENT_LEAD_SOURCE_OPTIONS,
  },
  {
    filterKey: 'name',
    label: 'Name',
    icon: IconLabel,
    type: 'text',
  },
  {
    filterKey: 'operational_address',
    label: 'Operational Address',
    icon: IconMapPin,
    type: 'text',
  },
  {
    filterKey: 'registered_date',
    label: 'Registered Date',
    icon: IconCalendarEvent,
    type: 'text',
  },
  {
    filterKey: 'registration_number',
    label: 'Registration Number',
    icon: IconNumber,
    type: 'text',
  },
  {
    filterKey: 'status',
    label: 'Status',
    icon: IconCheck,
    type: 'select',
    selectOptions: CLIENT_STATUS_OPTIONS,
  },
];

export const CLIENT_FILTER_QUERY_KEYS = CLIENT_FILTERS.map(
  (filter) => filter.filterKey,
);

// {
//   "aggregationPipeline": null,
//   "business_category": null,
//   "business_type": null,
//   "client_type": null,
//   "cvh_broker": null,
//   "isActive": null,
//   "lead_source": null,
//   "name": null,
//   "operational_address": null,
//   "registered_date": null,
//   "registration_number": null,
//   "status": null
// }
