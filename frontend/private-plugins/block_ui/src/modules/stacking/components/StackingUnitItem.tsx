import {
  CONTRACT_STAGE_COLORS,
  LOCKED_UNIT_COLOR,
} from '@/contract-status/constants';
import { IUnit } from '@/unit/types/unitType';
import { IconLockFilled } from '@tabler/icons-react';
import { cn, useQueryState } from 'erxes-ui';

export const StackingUnitItem = ({
  number,
  unitType,
  _id,
  activeContract,
}: IUnit) => {
  const [, setUnitId] = useQueryState<string>('unitId');

  const { size } = unitType || {};

  const stageType = activeContract?.statusType;
  const stagePreset = stageType
    ? CONTRACT_STAGE_COLORS[stageType as keyof typeof CONTRACT_STAGE_COLORS]
    : undefined;
  const isLocked = stageType === 'signed';
  const backgroundColor = isLocked
    ? LOCKED_UNIT_COLOR
    : activeContract?.statusColor || stagePreset?.color || 'var(--border)';
  const stageLabel = isLocked
    ? 'Locked'
    : activeContract?.statusLabel || stagePreset?.en || 'Available';

  return (
    <div
      key={number}
      className={cn(
        'blk:size-28 flex-none overflow-hidden min-w-px bgborder relative',
        isLocked && 'text-white',
      )}
      onClick={() => setUnitId(_id)}
      style={{ backgroundColor }}
    >
      <div className="p-3">
        <div className="font-bold mb-4 flex items-center gap-1">
          {number}
          {isLocked && <IconLockFilled className="size-4" />}
        </div>

        <div className="text-xs">{size} m²</div>
        <div className="text-xs">{stageLabel}</div>
      </div>
    </div>
  );
};
