import { InfoCard, Label, Select } from 'erxes-ui';
import { SelectCustomer } from 'ui-modules';
import { GrantSheetState } from '../../hooks/useGrantSheetState';

export const DetailsCard = ({
  customerId,
  setCustomerId,
  planId,
  setPlanId,
  plans,
  plansLoading,
  activeSub,
}: Pick<
  GrantSheetState,
  | 'customerId'
  | 'setCustomerId'
  | 'planId'
  | 'setPlanId'
  | 'plans'
  | 'plansLoading'
  | 'activeSub'
>) => (
  <InfoCard title="Details">
    <InfoCard.Content className="gap-4">
      <div className="space-y-1.5">
        <Label className="font-medium text-sm">Customer</Label>
        <SelectCustomer
          mode="single"
          value={customerId}
          onValueChange={(v) =>
            setCustomerId(Array.isArray(v) ? v[0] || '' : v)
          }
        />
      </div>

      <div className="space-y-1.5">
        <Label className="font-medium text-sm">Plan</Label>
        <Select value={planId} onValueChange={setPlanId}>
          <Select.Trigger className="w-full">
            <Select.Value
              placeholder={plansLoading ? 'Loading plans…' : 'Select a plan'}
            />
          </Select.Trigger>
          <Select.Content>
            {plans.map((plan) => {
              const isCurrent = activeSub?.plan?._id === plan._id;
              return (
                <Select.Item key={plan._id} value={plan._id}>
                  {plan.name} · {plan.durationMonths ?? '-'} months ·{' '}
                  {plan.price.toLocaleString()} {plan.currency || 'MNT'}
                  {isCurrent && (
                    <span className="ml-2 text-muted-foreground text-sm">
                      (Current)
                    </span>
                  )}
                </Select.Item>
              );
            })}
            {!plansLoading && plans.length === 0 && (
              <div className="px-2 py-1.5 text-muted-foreground text-sm">
                No active plans
              </div>
            )}
          </Select.Content>
        </Select>
      </div>
    </InfoCard.Content>
  </InfoCard>
);
