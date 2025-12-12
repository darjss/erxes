import { Button, Input, Popover, Select } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { ProviderFilters as ProviderFiltersType } from '../types/provider';
import { SelectCategory } from '~/modules/category/components/SelectCategory';
import { ProviderStatus } from '../types/provider';

interface ProviderFiltersProps {
  filters: ProviderFiltersType;
  onFiltersChange: (filters: ProviderFiltersType) => void;
}

export const ProviderFilters = ({
  filters,
  onFiltersChange,
}: ProviderFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof ProviderFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]:
        value === null || value === undefined || value === ''
          ? undefined
          : value,
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
                placeholder="Search by name, description, or location"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <Select
                value={filters.status || '__all__'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'status',
                    value === '__all__' ? undefined : value,
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="All statuses" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="__all__">All statuses</Select.Item>
                  <Select.Item value={ProviderStatus.PENDING}>
                    Pending
                  </Select.Item>
                  <Select.Item value={ProviderStatus.APPROVED}>
                    Approved
                  </Select.Item>
                  <Select.Item value={ProviderStatus.REJECTED}>
                    Rejected
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <SelectCategory
                selected={filters.categoryId}
                onSelect={(value) => handleFilterChange('categoryId', value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Active Status
              </label>
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
