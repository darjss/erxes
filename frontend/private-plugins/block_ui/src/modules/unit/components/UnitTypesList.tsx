import { useUnitTypes } from '@/unit/hooks/useUnitTypes';
import { IUnitType } from '@/unit/types/unitType';
import { IconPencil } from '@tabler/icons-react';
import { Button, CurrencyField, Empty, Label, Sheet, Spinner } from 'erxes-ui';
import { useState } from 'react';
import { SelectTenureType } from './SelectTenureType';
import { SelectUsageType } from './SelectUsageType';
import { UpdateUnitType } from './UpdateUnitType';
import { useParams } from 'react-router-dom';

export const UnitTypesList = () => {
  const { id } = useParams();
  const { unitTypes, loading } = useUnitTypes({ project: id || '' });

  if (loading) {
    return <Spinner containerClassName="py-32" />;
  }

  if (!unitTypes || unitTypes.length === 0) {
    return (
      <Empty>
        <Empty.Header>
          <Empty.Title>No unit types found</Empty.Title>
          <Empty.Description>
            There seems to be no unit types.
          </Empty.Description>
        </Empty.Header>
      </Empty>
    );
  }

  return (
    <>
      <div className="grid gap-3 grid-cols-6 [&>span]:whitespace-nowrap min-w-[56rem]">
        <Label asChild className="col-span-1">
          <span>Name</span>
        </Label>
        <Label asChild className="col-span-1">
          <span>Type</span>
        </Label>
        <Label asChild className="col-span-1">
          <span>Tenure Type</span>
        </Label>
        <Label asChild className="col-span-1">
          <span>Size</span>
        </Label>
        <Label asChild className="col-span-1">
          <span>Price</span>
        </Label>
        <Label asChild className="col-span-1">
          <span>Actions</span>
        </Label>
      </div>
      <div className="flex flex-col gap-2">
        {unitTypes?.map((unitType) => (
          <UnitTypesListItem key={unitType._id} unitType={unitType} />
        ))}
      </div>
    </>
  );
};

const UnitTypesListItem = ({ unitType }: { unitType: IUnitType }) => {
  return (
    <div className="grid gap-3 grid-cols-6 items-center">
      <div className="col-span-1 text-sm font-medium">{unitType.name}</div>
      <div className="col-span-1">
        <SelectUsageType value={unitType.type} />
      </div>
      <div className="col-span-1">
        <SelectTenureType value={unitType.tenureType} />
      </div>
      <div className="col-span-1">
        <CurrencyField.ValueInput value={unitType.size} disabled />
      </div>
      <div className="col-span-1">
        <CurrencyField.ValueInput value={unitType.price} disabled />
      </div>
      <div className="col-span-1 flex items-center gap-2">
        <UnitTypeListItemEdit unitType={unitType} />
      </div>
    </div>
  );
};

const UnitTypeListItemEdit = ({ unitType }: { unitType: IUnitType }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="secondary" size="icon">
          <IconPencil className="size-4" />
        </Button>
      </Sheet.Trigger>
      <Sheet.View>
        <Sheet.Header>
          <Sheet.Title>Edit unit type</Sheet.Title>
          <Sheet.Close tabIndex={-1} />
        </Sheet.Header>
        {open && (
          <UpdateUnitType unitType={unitType} onClose={() => setOpen(false)} />
        )}
      </Sheet.View>
    </Sheet>
  );
};
