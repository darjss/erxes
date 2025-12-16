import { CurrencyField, InfoCard, Label, useQueryState } from 'erxes-ui';
import { IUnitType } from '../types/unitType';
import { SelectTenureType } from './SelectTenureType';
import { SelectUsageType } from './SelectUsageType';

export const UnitTypeSummary = ({ unitType }: { unitType?: IUnitType }) => {
  const [, setActiveTab] = useQueryState('activeTab');
  return (
    <InfoCard title="Unit Type">
      <InfoCard.Content>
        <div className="gap-4 grid grid-cols-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="font-medium">{unitType?.name}</div>
          </div>
          <div className="space-y-2">
            <Label>Total room</Label>
            <div className="font-medium">{unitType?.roomsCount}</div>
          </div>
          <div className="space-y-2">
            <Label>Size</Label>
            <div className="font-medium">{unitType?.size}</div>
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <CurrencyField.ValueInput value={unitType?.price} />
          </div>
          <div className="space-y-2">
            <Label>Tenure Type</Label>
            <SelectTenureType
              value={{
                areaType: unitType?.areaType || '',
                tenureTypes: unitType?.tenureTypes || [],
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Usage Type</Label>
            <SelectUsageType value={unitType?.type} />
          </div>
        </div>
      </InfoCard.Content>
    </InfoCard>
  );
};
