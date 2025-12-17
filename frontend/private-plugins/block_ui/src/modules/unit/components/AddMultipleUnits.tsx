import { IZoning } from '@/building/types/buildingTypes';
import { addUnitsMultipleSchema } from '@/unit/constants/addUnitSchema';
import { useUnitCreate } from '@/unit/hooks/useUnitCreate';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconAlertCircle,
  IconArrowsMoveHorizontal,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  Alert,
  Button,
  Form,
  Input,
  Separator,
  Sheet,
  Spinner,
  toast,
  useQueryState,
} from 'erxes-ui';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SelectUnitType } from './SelectUnitType';

type AddUnitsMultipleForm = z.infer<typeof addUnitsMultipleSchema>;

export const AddUnitsMultiple = ({ zone }: { zone: IZoning }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="secondary">
          <IconPlus />
          Add multiple units
        </Button>
      </Sheet.Trigger>
      <Sheet.View>
        <Sheet.Header>
          <Sheet.Title className="text-base flex items-center gap-2">
            {zone.floor < 0 ? `B${zone.floor * -1}` : zone.floor}{' '}
            <Separator.Inline /> Add multiple units
          </Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <AddUnitsMultipleForm zone={zone} onClose={() => setOpen(false)} />
      </Sheet.View>
    </Sheet>
  );
};

export const AddUnitsMultipleForm = ({
  zone,
  onClose,
}: {
  zone: IZoning;
  onClose: () => void;
}) => {
  const [buildingId] = useQueryState('buildingId');

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(addUnitsMultipleSchema),
    defaultValues: {
      units: [],
      zoneRange: [],
    },
    shouldFocusError: false,
  });

  const { createUnits, loading } = useUnitCreate({ zoning: zone._id });

  const onSubmit = (data: z.infer<typeof addUnitsMultipleSchema>) => {
    createUnits({
      variables: {
        input: { ...data, buildingId },
      },
    });

    onClose();
    form.reset();

    toast({
      title: 'Success',
      description: 'Units created successfully',
      variant: 'default',
    });
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'units',
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col flex-auto"
        onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Sheet.Content className="p-6 blk:space-y-5">
          <Alert>
            <IconAlertCircle />
            <Alert.Title>Warning</Alert.Title>
            <Alert.Description>
              This will create multiple units with the same size and price based
              on the project's pricing.
            </Alert.Description>
          </Alert>

          {/* form content would go here */}

          <Form.Field
            name="zoneRange"
            render={({ field }) => (
              <Form.Item className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={field.value?.[0] ?? ''}
                  onChange={(e) => {
                    const newValue = [...(field.value || [])] as [
                      number,
                      number,
                    ];
                    newValue[0] = Number(e.target.value) || 0;
                    field.onChange(newValue);
                  }}
                />
                <IconArrowsMoveHorizontal className="text-muted-foreground w-6 self-center shrink-0" />
                <Input
                  type="number"
                  placeholder="0"
                  value={field.value?.[1] ?? ''}
                  onChange={(e) => {
                    const newValue = [...(field.value || [])] as [
                      number,
                      number,
                    ];
                    newValue[1] = Number(e.target.value) || 0;
                    field.onChange(newValue);
                  }}
                />
              </Form.Item>
            )}
          />

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 m-0">
              <div className="flex-1">
                <Form.Field
                  name={`units.${index}`}
                  render={({ field }) => (
                    <Form.Item>
                      <SelectUnitType
                        value={field.value}
                        onValueChange={field.onChange}
                        inForm
                      />
                    </Form.Item>
                  )}
                />
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="bg-destructive/10 hover:bg-destructive/20 size-8 text-destructive"
                onClick={() => remove(index)}
                type="button"
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => append('')}
            type="button"
          >
            <IconPlus className="mr-2 w-4 h-4" /> Add Unit
          </Button>
        </Sheet.Content>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Sheet.Close>
          <Button type="submit" disabled={loading}>
            <Spinner show={loading} />
            Add units
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
