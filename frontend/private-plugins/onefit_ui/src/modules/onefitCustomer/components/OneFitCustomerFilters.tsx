import { Button, Input, Popover, Select } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import {
  OneFitCustomerFilters,
  OneFitMembershipStatus,
} from '../types/onefitCustomer';

interface OneFitCustomerFiltersProps {
  filters: OneFitCustomerFilters;
  onFiltersChange: (filters: OneFitCustomerFilters) => void;
}

export const OneFitCustomerFiltersComponent = ({
  filters,
  onFiltersChange,
}: OneFitCustomerFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof OneFitCustomerFilters, value: any) => {
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
              <label className="mb-2 block text-sm font-medium">
                Membership Plan ID
              </label>
              <Input
                value={filters.membershipPlanId || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'membershipPlanId',
                    e.target.value || undefined,
                  )
                }
                placeholder="Filter by membership plan ID"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Membership Status
              </label>
              <Select
                value={filters.membershipStatus || '__all__'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'membershipStatus',
                    value === '__all__' ? undefined : value,
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="All statuses" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="__all__">All statuses</Select.Item>
                  <Select.Item value={OneFitMembershipStatus.ACTIVE}>
                    Active
                  </Select.Item>
                  <Select.Item value={OneFitMembershipStatus.EXPIRED}>
                    Expired
                  </Select.Item>
                  <Select.Item value={OneFitMembershipStatus.NONE}>
                    None
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Min Credit Balance
              </label>
              <Input
                type="number"
                value={filters.minCreditBalance || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'minCreditBalance',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="Minimum credit balance"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Max Credit Balance
              </label>
              <Input
                type="number"
                value={filters.maxCreditBalance || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'maxCreditBalance',
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="Maximum credit balance"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Activity Type ID
              </label>
              <Input
                value={filters.preferredActivityTypeId || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'preferredActivityTypeId',
                    e.target.value || undefined,
                  )
                }
                placeholder="Filter by preferred activity type"
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
