import { Input, Select } from 'erxes-ui';
import {
  BookingFilters,
  BookingStatus,
  AttendanceStatus,
} from '../types/booking';
import { SelectOneFitCustomer } from '~/modules/onefitCustomer/components/SelectOneFitCustomer';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';
import { FilterField } from '~/components/shared/FilterField';

interface BookingFiltersProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
}

export const BookingFiltersComponent = ({
  filters,
  onFiltersChange,
}: BookingFiltersProps) => {
  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  return (
    <OneFitFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <FilterField label="User">
        <SelectOneFitCustomer
          value={filters.userId || ''}
          onValueChange={(value) =>
            handleFilterChange('userId', value as string)
          }
        />
      </FilterField>
      <FilterField label="Provider">
        <SelectProviderSearchable
          value={filters.providerId || ''}
          onValueChange={(value) => handleFilterChange('providerId', value)}
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
            <Select.Item value={BookingStatus.CONFIRMED}>Confirmed</Select.Item>
            <Select.Item value={BookingStatus.CANCELLED}>Cancelled</Select.Item>
            <Select.Item value={BookingStatus.COMPLETED}>Completed</Select.Item>
            <Select.Item value={BookingStatus.NO_SHOW}>No Show</Select.Item>
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Attendance Status">
        <Select
          value={filters.attendanceStatus || '__all__'}
          onValueChange={(value) =>
            handleFilterChange(
              'attendanceStatus',
              value === '__all__' ? undefined : value,
            )
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="All attendance statuses" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">All attendance statuses</Select.Item>
            <Select.Item value={AttendanceStatus.PENDING}>Pending</Select.Item>
            <Select.Item value={AttendanceStatus.ATTENDED}>
              Attended
            </Select.Item>
            <Select.Item value={AttendanceStatus.NO_SHOW}>No Show</Select.Item>
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Booking Date">
        <Input
          type="date"
          value={
            filters.bookingDate
              ? new Date(filters.bookingDate).toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            handleFilterChange(
              'bookingDate',
              e.target.value ? new Date(e.target.value) : undefined,
            )
          }
        />
      </FilterField>
    </OneFitFilterBase>
  );
};
