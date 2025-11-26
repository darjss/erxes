import { IZoning } from '@/building/types/buildingTypes';
import { useUnits } from '@/unit/hooks/useUnits';
import { IUnit } from '@/unit/types/unitType';
import { Input, Label, Spinner } from 'erxes-ui';
import { useEffect } from 'react';
import { SelectUnitType } from './SelectUnitType';

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
      <div className="grid gap-3 grid-cols-2 [&>span]:whitespace-nowrap min-w-[56rem]">
        <Label asChild>
          <span>Дугаар</span>
        </Label>
        <Label asChild>
          <span>Unit type</span>
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
    <div className="grid gap-3 grid-cols-2">
      <Input value={unit.number} />
      <SelectUnitType value={unit.type || ''} />
    </div>
  );
};
