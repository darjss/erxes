import { useQuery } from '@apollo/client';
import { Select } from 'erxes-ui';
import { OneFitFilterBase } from '~/components/OneFitFilterBase';
import { FilterField } from '~/components/shared/FilterField';
import { ONE_FIT_ACTIVE_MEMBERSHIP_PLANS } from '~/modules/membership/graphql/membershipPlanQueries';
import { OneFitMembershipPlan } from '~/modules/membership/types/membership';
import { SelectOneFitCustomer } from '~/modules/onefitCustomer/components/SelectOneFitCustomer';
import { MembershipPurchaseFilters } from '../types/membershipPurchase';

interface MembershipPurchaseFiltersProps {
  filters: MembershipPurchaseFilters;
  onFiltersChange: (filters: MembershipPurchaseFilters) => void;
}

export function MembershipPurchaseFiltersComponent({
  filters,
  onFiltersChange,
}: MembershipPurchaseFiltersProps) {
  const { data } = useQuery(ONE_FIT_ACTIVE_MEMBERSHIP_PLANS);
  const plans: OneFitMembershipPlan[] = data?.oneFitActiveMembershipPlans || [];

  function handleFilterChange(
    key: keyof MembershipPurchaseFilters,
    value: any,
  ) {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  }

  return (
    <OneFitFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <FilterField label="Customer">
        <SelectOneFitCustomer.InlineCell
          value={filters.userId || ''}
          onValueChange={(value) =>
            handleFilterChange('userId', value as string)
          }
          mode="single"
          type="erxes"
        />
      </FilterField>

      <FilterField label="Plan">
        <Select
          value={filters.planId || '__all__'}
          onValueChange={(value) =>
            handleFilterChange('planId', value === '__all__' ? undefined : value)
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="All plans" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">All plans</Select.Item>
            {plans.map((plan) => (
              <Select.Item key={plan._id} value={plan._id}>
                {plan.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
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
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="paid">Paid</Select.Item>
            <Select.Item value="cancelled">Cancelled</Select.Item>
            <Select.Item value="failed">Failed</Select.Item>
          </Select.Content>
        </Select>
      </FilterField>
    </OneFitFilterBase>
  );
}

