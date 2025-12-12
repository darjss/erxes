import { Input } from 'erxes-ui';
import { ScheduleExceptionFilters } from '../types/schedule';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';

interface ScheduleExceptionFiltersProps {
  filters: ScheduleExceptionFilters;
  onFiltersChange: (filters: ScheduleExceptionFilters) => void;
}

export const ScheduleExceptionFiltersComponent = ({
  filters,
  onFiltersChange,
}: ScheduleExceptionFiltersProps) => {
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
  };

  return (
    <OneFitFilterBase
      filters={filters}
      onFiltersChange={onFiltersChange}
      excludeKeysFromCount={['providerId']}
      onClear={clearFilters}
    >
      <div>
        <label className="mb-2 block text-sm font-medium">Provider *</label>
        <SelectProviderSearchable
          value={filters.providerId || ''}
          onValueChange={(value) =>
            handleFilterChange('providerId', value || undefined)
          }
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Start Date</label>
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
    </OneFitFilterBase>
  );
};
