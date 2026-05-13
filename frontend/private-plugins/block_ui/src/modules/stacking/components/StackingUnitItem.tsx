import { CONTRACT_STAGE_COLORS } from '@/contract-status/constants';
import { IUnit } from '@/unit/types/unitType';
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
  const backgroundColor = stagePreset?.color || 'var(--border)';
  const stageLabel = stagePreset?.en || 'Available';
  const isSigned = stageType === 'signed';

  return (
    <div
      key={number}
      className={cn(
        'blk:size-28 flex-none overflow-hidden min-w-px bgborder relative',
        isSigned && 'text-white',
      )}
      onClick={() => setUnitId(_id)}
      style={{ backgroundColor }}
    >
      <div className="p-3">
        <div className="font-bold mb-4 flex items-center gap-1">{number}</div>

        <div className="text-xs">{size} m²</div>
        <div className="text-xs">{stageLabel}</div>
      </div>
    </div>
  );
};
