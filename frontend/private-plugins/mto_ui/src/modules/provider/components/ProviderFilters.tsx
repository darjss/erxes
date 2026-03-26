import { Input, Select } from 'erxes-ui';
import { ProviderFilters as ProviderFiltersType } from '../types/provider';
import { ProviderStatus } from '../types/provider';
import { MtoFilterBase } from '~/components/MtoFilterBase';
import { FilterField } from '~/components/shared/FilterField';

interface ProviderFiltersProps {
  filters: ProviderFiltersType;
  onFiltersChange: (filters: ProviderFiltersType) => void;
}

export const ProviderFilters = ({
  filters,
  onFiltersChange,
}: ProviderFiltersProps) => {
  const handleFilterChange = (key: keyof ProviderFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]:
        value === null || value === undefined || value === ''
          ? undefined
          : value,
    });
  };

  return (
    <MtoFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <FilterField label="Search">
        <Input
          value={filters.searchValue || ''}
          onChange={(e) => handleFilterChange('searchValue', e.target.value)}
          placeholder="Search by name or description"
        />
      </FilterField>
      <FilterField label="Status">
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
            <Select.Item value={ProviderStatus.PENDING}>Pending</Select.Item>
            <Select.Item value={ProviderStatus.APPROVED}>Approved</Select.Item>
            <Select.Item value={ProviderStatus.REJECTED}>Rejected</Select.Item>
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Active Status">
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
      </FilterField>
    </MtoFilterBase>
  );
};
