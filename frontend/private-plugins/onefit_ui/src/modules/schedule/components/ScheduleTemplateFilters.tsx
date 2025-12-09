import { Button, Input, Popover, Select } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { ScheduleTemplateFilters } from '../types/schedule';
import { MONTHS } from '../utils/scheduleUtils';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';

interface ScheduleTemplateFiltersProps {
  filters: ScheduleTemplateFilters;
  onFiltersChange: (filters: ScheduleTemplateFilters) => void;
}

export const ScheduleTemplateFiltersComponent = ({
  filters,
  onFiltersChange,
}: ScheduleTemplateFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof ScheduleTemplateFilters,
    value: any,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setIsOpen(false);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const months = MONTHS.map((month) => ({
    value: month.value.toString(),
    label: month.label,
  }));

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button variant="outline" className="gap-2">
            <IconFilter2 />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-80" align="start">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Provider</label>
              <SelectProviderSearchable
                value={filters.providerId || ''}
                onValueChange={(value) =>
                  handleFilterChange('providerId', value || undefined)
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Year</label>
              <Input
                type="number"
                value={filters.year || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'year',
                    e.target.value ? parseInt(e.target.value, 10) : undefined,
                  )
                }
                placeholder="Enter year"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Month</label>
              <Select
                value={
                  filters.month === undefined
                    ? '__all__'
                    : filters.month.toString()
                }
                onValueChange={(value) =>
                  handleFilterChange(
                    'month',
                    value === '__all__' ? undefined : parseInt(value, 10),
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="All months" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="__all__">All months</Select.Item>
                  {months.map((month) => (
                    <Select.Item key={month.value} value={month.value}>
                      {month.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <IconX />
                Clear Filters
              </Button>
            )}
          </div>
        </Popover.Content>
      </Popover>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <IconX />
          Clear
        </Button>
      )}
    </div>
  );
};
