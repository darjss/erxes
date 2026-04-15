import { Select } from 'erxes-ui';
import { useUpdateUnitStatus } from '../hooks/useUpdateUnitStatus';
import { BlockUnitStatus } from '../types/unit';

const STATUS_OPTIONS: { value: BlockUnitStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
  { value: 'leased', label: 'Leased' },
];

const STATUS_COLORS: Record<BlockUnitStatus, string> = {
  available: 'text-green-600',
  reserved: 'text-amber-500',
  sold: 'text-blue-500',
  leased: 'text-purple-500',
};

interface Props {
  unitId: string;
  status?: BlockUnitStatus;
}

export const SelectUnitStatus = ({ unitId, status = 'available' }: Props) => {
  const { updateStatus, loading } = useUpdateUnitStatus();

  return (
    <Select
      value={status}
      onValueChange={(val) => updateStatus(unitId, val)}
      disabled={loading}
    >
      <Select.Trigger className="h-7 w-[110px] text-xs border-none shadow-none focus:ring-0 px-2">
        <Select.Value>
          <span className={STATUS_COLORS[status]}>
            {STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}
          </span>
        </Select.Value>
      </Select.Trigger>
      <Select.Content>
        {STATUS_OPTIONS.map(({ value, label }) => (
          <Select.Item key={value} value={value}>
            <span className={STATUS_COLORS[value]}>{label}</span>
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};
