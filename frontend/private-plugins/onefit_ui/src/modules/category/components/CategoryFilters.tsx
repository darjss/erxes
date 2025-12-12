import { Input, Select } from 'erxes-ui';
import { CategoryFilters } from '../types/category';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';

interface CategoryFiltersProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
}

export const CategoryFiltersComponent = ({
  filters,
  onFiltersChange,
}: CategoryFiltersProps) => {
  const handleFilterChange = (key: keyof CategoryFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <OneFitFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <div>
        <label className="mb-2 block text-sm font-medium">Search</label>
        <Input
          value={filters.searchValue || ''}
          onChange={(e) => handleFilterChange('searchValue', e.target.value)}
          placeholder="Search by name or description"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Name</label>
        <Input
          value={filters.name || ''}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          placeholder="Filter by exact name"
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
    </OneFitFilterBase>
  );
};
