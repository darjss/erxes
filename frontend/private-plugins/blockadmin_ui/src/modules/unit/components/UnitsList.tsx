import { IZoning } from '@/building/types/buildingTypes';
import { SelectTenureType } from '@/unit/components/SelectTenureType';
import { SelectUsageType } from '@/unit/components/SelectUsageType';
import { useUnits } from '@/unit/hooks/useUnits';
import { IUnit } from '@/unit/types/unitType';
import { CurrencyField, Input, Label, Spinner } from 'erxes-ui';
import { useEffect } from 'react';

export const UnitsList = ({
  zone,
  setUnitsCount,
}: {
  zone: IZoning;
  setUnitsCount: (count: number) => void;
}) => {
  const { units, loading } = useUnits({
    variables: { zoning: zone._id },
  });

  useEffect(() => {
    if (units?.length) {
      setUnitsCount(units?.length || 0);
    }
  }, [setUnitsCount, units]);

  if (loading) {
    return <Spinner containerClassName="py-32" />;
  }

  const sortedUnits = units
    ? [...units].sort((a, b) => a.number.localeCompare(b.number))
    : undefined;

  return (
    <>
      <div className="grid gap-3 grid-cols-4 [&>span]:whitespace-nowrap min-w-[56rem]">
        <Label asChild>
          <span>Code</span>
        </Label>
        <Label asChild>
          <span>Usage type</span>
        </Label>
        <Label asChild>
          <span>Tenure type</span>
        </Label>
        <Label asChild>
          <span>Area m²</span>
        </Label>
      </div>
      {sortedUnits?.map((unit) => (
        <UnitsListItem key={unit._id} unit={unit} />
      ))}
    </>
  );
};

export const UnitsListItem = ({ unit }: { unit: IUnit }) => {
  return (
    <div className="grid gap-3 grid-cols-4">
      <Input value={unit.number} />
      <SelectUsageType value={unit.type} />
      <SelectTenureType value={unit.tenureType} />
      <CurrencyField.ValueInput value={unit.size} />
    </div>
  );
};
