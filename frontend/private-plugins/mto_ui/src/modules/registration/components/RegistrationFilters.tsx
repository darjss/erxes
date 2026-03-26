import { Select } from 'erxes-ui';
import { useQuery } from '@apollo/client';
import { MtoFilterBase } from '~/components/MtoFilterBase';
import { FilterField } from '~/components/shared/FilterField';
import { MTO_REGISTRATION_MEMBERSHIP_SUMMARIES } from '@/registration/graphql/registrationQueries';
import { RegistrationFilters as RegistrationFiltersType } from '@/registration/types/registrationFilters';

const STATUS_OPTIONS = [
  { value: '__all__', label: 'Бүх төлөв' },
  { value: 'draft', label: 'draft' },
  { value: 'submitted', label: 'submitted' },
  { value: 'under_review', label: 'under_review' },
  { value: 'approved', label: 'approved' },
  { value: 'rejected', label: 'rejected' },
];

interface RegistrationFiltersProps {
  filters: RegistrationFiltersType;
  onFiltersChange: (filters: RegistrationFiltersType) => void;
}

export function RegistrationFilters({
  filters,
  onFiltersChange,
}: RegistrationFiltersProps) {
  const { data } = useQuery(MTO_REGISTRATION_MEMBERSHIP_SUMMARIES);

  const summaries = data?.mtoRegistrationMembershipSummaries ?? [];

  function handleChange<K extends keyof RegistrationFiltersType>(
    key: K,
    value: RegistrationFiltersType[K] | undefined,
  ) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <MtoFilterBase filters={filters} onFiltersChange={onFiltersChange}>
      <FilterField label="Төрөл">
        <Select
          value={filters.membershipTypeId || '__all__'}
          onValueChange={(v) =>
            handleChange(
              'membershipTypeId',
              v === '__all__' ? undefined : v,
            )
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="Бүх төрөл" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="__all__">Бүх төрөл</Select.Item>
            {summaries.map(
              (s: { membershipTypeId: string; title: string }) => (
                <Select.Item key={s.membershipTypeId} value={s.membershipTypeId}>
                  {s.title}
                </Select.Item>
              ),
            )}
          </Select.Content>
        </Select>
      </FilterField>
      <FilterField label="Төлөв">
        <Select
          value={filters.status || '__all__'}
          onValueChange={(v) =>
            handleChange('status', v === '__all__' ? undefined : v)
          }
        >
          <Select.Trigger>
            <Select.Value placeholder="Төлөв" />
          </Select.Trigger>
          <Select.Content>
            {STATUS_OPTIONS.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </FilterField>
    </MtoFilterBase>
  );
}
