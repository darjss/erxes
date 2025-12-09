import { Button, Input, Popover, Select } from 'erxes-ui';
import { IconFilter2, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import {
  CreditTransactionFilters,
  OneFitCreditTransactionType,
  OneFitCreditSource,
} from '../types/credit';
import { SelectCustomer } from 'ui-modules';

interface CreditTransactionFiltersProps {
  filters: CreditTransactionFilters;
  onFiltersChange: (filters: CreditTransactionFilters) => void;
}

export const CreditTransactionFiltersComponent = ({
  filters,
  onFiltersChange,
}: CreditTransactionFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof CreditTransactionFilters,
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
              <label className="mb-2 block text-sm font-medium">
                Transaction Type
              </label>
              <Select
                value={filters.transactionType || '__all__'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'transactionType',
                    value === '__all__' ? undefined : value,
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="All" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="__all__">All</Select.Item>
                  <Select.Item value={OneFitCreditTransactionType.PURCHASE}>
                    Purchase
                  </Select.Item>
                  <Select.Item value={OneFitCreditTransactionType.USAGE}>
                    Usage
                  </Select.Item>
                  <Select.Item value={OneFitCreditTransactionType.REFUND}>
                    Refund
                  </Select.Item>
                  <Select.Item value={OneFitCreditTransactionType.EXPIRATION}>
                    Expiration
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Source</label>
              <Select
                value={filters.source || '__all__'}
                onValueChange={(value) =>
                  handleFilterChange(
                    'source',
                    value === '__all__' ? undefined : value,
                  )
                }
              >
                <Select.Trigger>
                  <Select.Value placeholder="All" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="__all__">All</Select.Item>
                  <Select.Item value={OneFitCreditSource.INDIVIDUAL}>
                    Individual
                  </Select.Item>
                  <Select.Item value={OneFitCreditSource.CORPORATE}>
                    Corporate
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Booking ID
              </label>
              <Input
                value={filters.bookingId || ''}
                onChange={(e) =>
                  handleFilterChange('bookingId', e.target.value)
                }
                placeholder="Filter by booking ID"
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
