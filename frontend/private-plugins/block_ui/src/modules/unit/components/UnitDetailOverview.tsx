import { PricingDetail } from '@/pricing/components/PricingDetail';
import { SelectTenureType } from '@/unit/components/SelectTenureType';
import { SelectUnitStatus } from '@/unit/components/SelectUnitStatus';
import { SelectUsageType } from '@/unit/components/SelectUsageType';
import { useUnitContext } from '@/unit/context/unitContext';
import { useUnitUpdate } from '@/unit/hooks/useUnitUpdate';
import { CurrencyField, Input, Label, Separator } from 'erxes-ui';
import { useState } from 'react';

export const UnitDetailOverview = () => {
  const { unit } = useUnitContext();
  // const [mainPrice, setMainPrice] = useState(unit?.mainPrice);
  const { updateUnit } = useUnitUpdate({ id: unit?._id });
  const [size, setSize] = useState(unit?.size);

  // useEffect(() => {
  //   if (unit?.mainPrice) {
  //     setMainPrice(unit?.mainPrice);
  //   }
  //   if (unit?.size) {
  //     setSize(unit?.size);
  //   }
  // }, [unit]);

  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-2 blk:gap-x-3 blk:gap-y-5 p-8">
        <div className="space-y-2">
          <Label>Number</Label>
          <Input
            value={unit.number}
            className="font-medium disabled:opacity-100"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label>Usage Type</Label>
          <SelectUsageType
            value={unit.type}
            onValueChange={(value) => updateUnit({ type: value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tenure Type</Label>
          <SelectTenureType
            value={unit.tenureType}
            onValueChange={(value) => updateUnit({ tenureType: value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <SelectUnitStatus
            value={unit.status}
            onValueChange={(value) => updateUnit({ status: value })}
            tenureType={unit.tenureType}
          />
        </div>
      </div>

      <Separator />

      <div className="blk:space-y-5 p-8">
        <PricingDetail
          mainPrice={unit.mainPrice}
          prices={unit.prices}
          updateUnit={updateUnit}
        />
        <div className="space-y-2 col-span-3">
          <Label>Area</Label>
          <CurrencyField.ValueInput
            value={size}
            onChange={(value) => setSize(value)}
            onBlur={() => size !== unit.size && updateUnit({ size })}
          />
        </div>
        <div className="space-y-2">
          <Label>total price</Label>
          <CurrencyField.ValueInput
            value={unit.size * unit.mainPrice}
            disabled
            className="disabled:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};
