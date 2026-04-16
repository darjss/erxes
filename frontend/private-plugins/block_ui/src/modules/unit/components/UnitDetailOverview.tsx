import { SelectUnitStatus } from '@/unit/components/SelectUnitStatus';
import { useUnitContext } from '@/unit/context/unitContext';
import { useUnitType } from '@/unit/hooks/useUnitType';
import { useUnitUpdate } from '@/unit/hooks/useUnitUpdate';
import { Input, Label, Separator } from 'erxes-ui';
import { SelectUnitType } from './SelectUnitType';
import { UnitTypeSummary } from './UnitTypeSummary';
import { UnitTransferSection } from './UnitTransferSection';

export const UnitDetailOverview = () => {
  const { unit } = useUnitContext();

  const { number, type, agencyEntityId, agencySubdomain } = unit || {};

  const { unitType } = useUnitType(type);

  const { updateUnit } = useUnitUpdate({ id: unit?._id, zoning: unit?.zoning });

  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-2 blk:gap-x-3 blk:gap-y-5 p-8">
        <div className="space-y-2">
          <Label>Number</Label>
          <Input
            value={number}
            className="font-medium disabled:opacity-100"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label>Unit Type</Label>
          <SelectUnitType
            value={type || ''}
            onValueChange={(value) => updateUnit({ type: value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <SelectUnitStatus
            value={unit?.status}
            onValueChange={(value) => updateUnit({ status: value })}
            tenureType={unitType?.tenureType}
          />
        </div>
        <UnitTransferSection
          unitId={unit?._id}
          agencyEntityId={agencyEntityId}
          agencySubdomain={agencySubdomain}
        />
      </div>
      <Separator />
      <div className="p-5">
        <UnitTypeSummary unitType={unitType} />
      </div>
    </div>
  );
};
