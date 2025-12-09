import { Button, Input, Popover } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { ScheduleExceptionFilters } from '../types/schedule';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';

interface ScheduleExceptionFiltersProps {
  filters: ScheduleExceptionFilters;
  onFiltersChange: (filters: ScheduleExceptionFilters) => void;
}

export const ScheduleExceptionFiltersComponent = ({
  filters,
  onFiltersChange,
}: ScheduleExceptionFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof ScheduleExceptionFilters,
    value: any,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      providerId: filters.providerId,
    });
    setIsOpen(false);
  };

  const hasActiveFilters =
    Object.keys(filters).filter((key) => key !== 'providerId').length > 0;

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <Button variant="outline" className="gap-2">
            <IconFilter2 />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {
                  Object.keys(filters).filter((key) => key !== 'providerId')
                    .length
                }
              </span>
            )}
          </Button>
        </Popover.Trigger>
        <Popover.Content className="w-80" align="start">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Provider *
              </label>
              <SelectProviderSearchable
                value={filters.providerId || ''}
                onValueChange={(value) =>
                  handleFilterChange('providerId', value || undefined)
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date
              </label>
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  handleFilterChange('startDate', e.target.value || undefined)
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  handleFilterChange('endDate', e.target.value || undefined)
                }
              />
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
