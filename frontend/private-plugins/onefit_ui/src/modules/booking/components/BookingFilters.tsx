import { Button, Input, Popover, Select } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import {
  BookingFilters,
  BookingStatus,
  AttendanceStatus,
} from '../types/booking';
import { SelectCustomer } from 'ui-modules';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';

interface BookingFiltersProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
}

export const BookingFiltersComponent = ({
  filters,
  onFiltersChange,
}: BookingFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof BookingFilters, value: any) => {
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
              <label className="mb-2 block text-sm font-medium">User</label>
              <SelectCustomer
                value={filters.userId || ''}
                onValueChange={(value) =>
                  handleFilterChange('userId', value as string)
                }
                type="customer"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Provider</label>
              <SelectProviderSearchable
                value={filters.providerId || ''}
                onValueChange={(value) =>
                  handleFilterChange('providerId', value)
                }
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
                  <Select.Item value={BookingStatus.CONFIRMED}>
                    Confirmed
                  </Select.Item>
                  <Select.Item value={BookingStatus.CANCELLED}>
                    Cancelled
                  </Select.Item>
                  <Select.Item value={BookingStatus.COMPLETED}>
                    Completed
                  </Select.Item>
                  <Select.Item value={BookingStatus.NO_SHOW}>
                    No Show
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Attendance Status
              </label>
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
                  <Select.Item value="__all__">
                    All attendance statuses
                  </Select.Item>
                  <Select.Item value={AttendanceStatus.PENDING}>
                    Pending
                  </Select.Item>
                  <Select.Item value={AttendanceStatus.ATTENDED}>
                    Attended
                  </Select.Item>
                  <Select.Item value={AttendanceStatus.NO_SHOW}>
                    No Show
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Booking Date
              </label>
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
