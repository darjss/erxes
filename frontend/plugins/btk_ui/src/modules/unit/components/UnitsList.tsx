import {
  Button,
  CurrencyField,
  Input,
  Label,
  Spinner,
  useConfirm,
  useQueryState,
} from 'erxes-ui';
import { AddUnitSheet } from './AddUnit';
import { SelectUsageType } from '@/unit/components/SelectUsageType';
import { useUnits } from '@/unit/hooks/useUnits';
import { IUnit } from '@/unit/types/unitType';
import { IZoning } from '@/building/types/buildingTypes';
import { useEffect, useState } from 'react';
import { useUnitUpdate } from '@/unit/hooks/useUnitUpdate';
import { useUnitRemove } from '@/unit/hooks/useUnitRemove';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { BTK_GET_UNITS } from '@/unit/graphql/unitQueries';
import { SelectTenureType } from '@/unit/components/SelectTenureType';
import { AddUnitsMultiple } from '@/unit/components/AddMultipleUnits';

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
        <Label asChild>
          <span>Actions</span>
        </Label>
      </div>
      {sortedUnits?.map((unit) => (
        <UnitsListItem key={unit._id} unit={unit} zone={zone} />
      ))}
      <div className="grid grid-cols-2 gap-4">
        <AddUnitSheet zone={zone} />
        <AddUnitsMultiple zone={zone} />
      </div>
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
  const [unitSize, setUnitSize] = useState(unit.size);
  const [unitNumber, setUnitNumber] = useState(unit.number);
  const { updateUnit } = useUnitUpdate({ id: unit._id });
  return (
    <div className="grid gap-3 grid-cols-5">
      <Input
        value={unitNumber}
        onChange={(e) => setUnitNumber(e.target.value)}
        onBlur={() =>
          unitNumber !== unit.number && updateUnit({ number: unitNumber })
        }
      />
      <SelectUsageType
        value={unit.type}
        onValueChange={(value) => updateUnit({ type: value })}
      />
      <SelectTenureType
        value={unit.tenureType}
        onValueChange={(value) => updateUnit({ tenureType: value })}
      />
      <CurrencyField.ValueInput
        value={unitSize}
        onChange={(value) => setUnitSize(value)}
        onBlur={() => unitSize !== unit.size && updateUnit({ size: unitSize })}
      />
      <div className="flex items-center gap-2">
        <UnitListItemRemove unit={unit} zone={zone} />
        <UnitListItemEdit unit={unit} />
      </div>
    </div>
  );
};

export const UnitListItemRemove = ({
  unit,
  zone,
}: {
  unit: IUnit;
  zone: IZoning;
}) => {
  const { removeUnit } = useUnitRemove();
  const { confirm } = useConfirm();
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() =>
        confirm({
          message: `Are you sure you want to remove '${unit.number}'`,
          options: { confirmationValue: '' },
        }).then(() =>
          removeUnit({
            variables: { id: unit._id },
            refetchQueries: [
              { query: BTK_GET_UNITS, variables: { zoning: zone._id } },
            ],
          }),
        )
      }
      className="text-destructive bg-destructive/10 hover:bg-destructive/20"
    >
      <IconTrash />
    </Button>
  );
};

export const UnitListItemEdit = ({ unit }: { unit: IUnit }) => {
  const [, setUnitId] = useQueryState('unitId');
  return (
    <Button variant="secondary" size="icon" onClick={() => setUnitId(unit._id)}>
      <IconPencil />
    </Button>
  );
};
