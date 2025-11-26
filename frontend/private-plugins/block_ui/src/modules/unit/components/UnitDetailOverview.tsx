import { PricingDetail } from '@/pricing/components/PricingDetail';
import { SelectTenureType } from '@/unit/components/SelectTenureType';
import { SelectUnitStatus } from '@/unit/components/SelectUnitStatus';
import { SelectUsageType } from '@/unit/components/SelectUsageType';
import { useUnitContext } from '@/unit/context/unitContext';
import { useUnitUpdate } from '@/unit/hooks/useUnitUpdate';
import { CurrencyField, Input, Label, Separator } from 'erxes-ui';

export const UnitDetailOverview = () => {
  const { unit } = useUnitContext();

  const { number, type: unitType } = unit || {};

  const { size, price, prices, type, tenureType } = unitType || {};

  // const [mainPrice, setMainPrice] = useState(unit?.mainPrice);
  const { updateUnit } = useUnitUpdate({ id: unit?._id });

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
            value={number}
            className="font-medium disabled:opacity-100"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label>Usage Type</Label>
          <SelectUsageType value={type} />
        </div>
        <div className="space-y-2">
          <Label>Tenure Type</Label>
          <SelectTenureType value={tenureType} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <SelectUnitStatus
            value={status}
            onValueChange={(value) => updateUnit({ status: value })}
            tenureType={tenureType}
          />
        </div>
      </div>

      <Separator />

      <div className="blk:space-y-5 p-8">
        <PricingDetail
          mainPrice={price}
          prices={prices}
          updateUnit={(data) => updateUnit({ type: { ...unitType, ...data } })}
        />
        <div className="space-y-2 col-span-3">
          <Label>Area</Label>
          <CurrencyField.ValueInput
            value={size}
            onChange={(value) =>
              updateUnit({ type: { ...unitType, size: value } })
            }
            onBlur={() =>
              size !== size && updateUnit({ type: { ...unitType, size } })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>total price</Label>
          <CurrencyField.ValueInput
            value={size * price}
            disabled
            className="disabled:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};
