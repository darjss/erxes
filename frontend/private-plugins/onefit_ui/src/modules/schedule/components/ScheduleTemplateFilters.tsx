import { Input, Select } from 'erxes-ui';
import { ScheduleTemplateFilters } from '../types/schedule';
import { MONTHS } from '../utils/scheduleUtils';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';

interface ScheduleTemplateFiltersProps {
  filters: ScheduleTemplateFilters;
  onFiltersChange: (filters: ScheduleTemplateFilters) => void;
}

export const ScheduleTemplateFiltersComponent = ({
  filters,
  onFiltersChange,
}: ScheduleTemplateFiltersProps) => {
  const handleFilterChange = (
    key: keyof ScheduleTemplateFilters,
    value: any,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const months = MONTHS.map((month) => ({
    value: month.value.toString(),
    label: month.label,
  }));

  return (
    <OneFitFilterBase filters={filters} onFiltersChange={onFiltersChange}>
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
            filters.month === undefined ? '__all__' : filters.month.toString()
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
    </OneFitFilterBase>
  );
};
