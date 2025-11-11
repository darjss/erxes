import { CurrencyField, Input, Label, Separator } from 'erxes-ui';
import { PricingDetail } from 'frontend/private-plugins/blockadmin_ui/src/modules/pricing/components/PricingDetail';
import { SelectTenureType } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/components/SelectTenureType';
import { SelectUnitStatus } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/components/SelectUnitStatus';
import { SelectUsageType } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/components/SelectUsageType';
import { useUnitContext } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/context/unitContext';
import { useUnitUpdate } from 'frontend/private-plugins/blockadmin_ui/src/modules/unit/hooks/useUnitUpdate';
import { useEffect, useState } from 'react';

export const UnitDetailOverview = () => {
  const { unit } = useUnitContext();
  const [mainPrice, setMainPrice] = useState(unit?.mainPrice);
  const { updateUnit } = useUnitUpdate({ id: unit?._id });
  const [size, setSize] = useState(unit?.size);

  useEffect(() => {
    if (unit?.mainPrice) {
      setMainPrice(unit?.mainPrice);
    }
    if (unit?.size) {
      setSize(unit?.size);
    }
  }, [unit]);

  return (
    <div>
      <div className="grid lg:grid-cols-3 grid-cols-2 gap-x-3 gap-y-5 p-8">
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

      <div className="space-y-5 p-8">
        <PricingDetail
          mainPrice={mainPrice}
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
            value={unit.size * mainPrice}
            disabled
            className="disabled:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};
