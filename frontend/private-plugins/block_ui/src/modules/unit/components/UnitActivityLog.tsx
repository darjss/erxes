import { useUnitContext } from '@/unit/context/unitContext';
import { ActivityLogs } from 'ui-modules';

export const UnitActivityLog = () => {
  const { unit } = useUnitContext();

  return (
    <ActivityLogs
      targetId={unit._id}
      targetType="block:block.units"
      variant="backward"
    />
  );
};
