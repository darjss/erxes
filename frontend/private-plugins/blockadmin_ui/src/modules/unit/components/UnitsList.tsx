import { IZoning } from '@/building/types/buildingTypes';
import { useUnits } from '@/unit/hooks/useUnits';
import { IUnit } from '@/unit/types/unitType';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { Button, Input, Label, Spinner } from 'erxes-ui';
import { useEffect } from 'react';
import { useUnitUpdate } from '../hooks/useUnitUpdate';
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
      <div className="grid gap-3 grid-cols-5 [&>span]:whitespace-nowrap min-w-[56rem]">
        <Label asChild>
          <span className="col-span-2">Дугаар</span>
        </Label>
        <Label asChild>
          <span className="col-span-3">Unit type</span>
        </Label>
      </div>
      {sortedUnits?.map((unit) => (
        <UnitsListItem key={unit._id} unit={unit} zone={zone} />
      ))}
    </>
  );
};

export const UnitsListItem = ({
  unit,
  zone,
}: {
  unit: IUnit;
  zone: IZoning;
}) => {
  return (
    <div className="grid gap-3 grid-cols-5">
      <div className="col-span-2">
        <Input value={unit.number} />
      </div>
      <div className="flex items-center gap-3 col-span-3">
        <SelectUnitType value={unit.type || ''} />
        <UnitListItemEdit unit={unit} zone={zone} />
      </div>
    </div>
  );
};

export const UnitListItemEdit = ({
  unit,
  zone,
}: {
  unit: IUnit;
  zone: IZoning;
}) => {
  const { updateUnit } = useUnitUpdate({ id: unit._id, zoning: zone._id });

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => updateUnit({ isFeatured: !unit.isFeatured })}
    >
      {unit.isFeatured ? <IconStarFilled /> : <IconStar />}
    </Button>
  );
};
