import { Filter, Select, useQueryState } from 'erxes-ui';

const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusVariant = (status?: string) => {
  if (status === 'active') return 'success';
  if (status === 'expired') return 'destructive';
  return 'secondary';
};

const FilterView = () => {
  const [status, setStatus] = useQueryState<string>('status');
  return (
    <Filter.View filterKey="status">
      <Select value={status || ''} onValueChange={setStatus}>
        <Select.Trigger className="w-full" />
        <Select.Content>
          {STATUSES.map((s) => (
            <Select.Item key={s.value} value={s.value}>
              {s.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </Filter.View>
  );
};

const FilterBar = () => {
  const [status] = useQueryState<string>('status');
  const label = STATUSES.find((s) => s.value === status)?.label;
  return (
    <Filter.BarButton filterKey="status">{label || ''}</Filter.BarButton>
  );
};

export const SelectSubscriberStatus = {
  FilterView,
  FilterBar,
  statusVariant,
};
