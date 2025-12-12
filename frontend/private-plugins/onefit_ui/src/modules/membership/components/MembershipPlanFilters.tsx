import { Input, Select } from 'erxes-ui';
import { MembershipPlanFilters } from '../types/membership';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';
import { FilterField } from '~/components/shared/FilterField';

interface MembershipPlanFiltersProps {
  filters: MembershipPlanFilters;
  onFiltersChange: (filters: MembershipPlanFilters) => void;
}

export const MembershipPlanFiltersComponent = ({
  filters,
  onFiltersChange,
}: MembershipPlanFiltersProps) => {
  const handleFilterChange = (key: keyof MembershipPlanFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <OneFitFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <FilterField label="Search">
        <Input
          value={filters.searchValue || ''}
          onChange={(e) => handleFilterChange('searchValue', e.target.value)}
          placeholder="Search by name or description"
        />
      </FilterField>
      <FilterField label="Status">
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
    </OneFitFilterBase>
  );
};
