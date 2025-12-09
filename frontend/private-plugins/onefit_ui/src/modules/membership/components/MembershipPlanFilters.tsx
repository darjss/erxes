import { Button, Input, Popover, Select } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { MembershipPlanFilters } from '../types/membership';

interface MembershipPlanFiltersProps {
  filters: MembershipPlanFilters;
  onFiltersChange: (filters: MembershipPlanFilters) => void;
}

export const MembershipPlanFiltersComponent = ({
  filters,
  onFiltersChange,
}: MembershipPlanFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof MembershipPlanFilters,
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
              <label className="mb-2 block text-sm font-medium">Search</label>
              <Input
                value={filters.searchValue || ''}
                onChange={(e) =>
                  handleFilterChange('searchValue', e.target.value)
                }
                placeholder="Search by name or description"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <Select
                value={
                  filters.isActive === undefined
                    ? '__all__'
                    : filters.isActive
                      ? 'true'
                      : 'false'
                }
                onValueChange={(value) =>
                  handleFilterChange(
                    'isActive',
                    value === '__all__' ? undefined : value === 'true',
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="All statuses" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="__all__">All statuses</Select.Item>
                  <Select.Item value="true">Active</Select.Item>
                  <Select.Item value="false">Inactive</Select.Item>
                </Select.Content>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full">
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

