import { unitTypeSchema } from '@/unit/constants/unitTypeSchema';
import { useUnitTypeUpdate } from '@/unit/hooks/useUnitTypeUpdate';
import { IUnitType } from '@/unit/types/unitType';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  Button,
  CurrencyField,
  Editor,
  Form,
  Input,
  Label,
  ScrollArea,
  Select,
  Sheet,
  Spinner,
} from 'erxes-ui';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SelectTenureType } from './SelectTenureType';
import { SelectUsageType } from './SelectUsageType';
import { useParams } from 'react-router-dom';

export const UpdateUnitType = ({
  unitType,
  onClose,
}: {
  unitType: IUnitType;
  onClose: () => void;
}) => {
  const { id } = useParams();
  const form = useForm<z.infer<typeof unitTypeSchema>>({
    resolver: zodResolver(unitTypeSchema),
    defaultValues: {
      name: unitType.name || '',
      description: unitType.description || '',
      size: unitType.size || 0,
      type: unitType.type || '',
      tenureType: unitType.tenureType || '',
      content: unitType.content || '',
      price: unitType.price || 0,
      prices:
        unitType.prices?.map((p) => ({
          currency: p.currency,
          price: p.price,
          priceType: p.priceType as 'priceBySize' | 'priceByUnit',
        })) || [],
      status: unitType.status || '',
      roomsCount: unitType.roomsCount || 0,
    },
  });

  const { updateUnitType, loading } = useUnitTypeUpdate({ id: unitType._id });

  const onSubmit = (data: z.infer<typeof unitTypeSchema>) => {
    updateUnitType({ ...data, project: id || '' });
    onClose();
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'prices',
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col flex-auto overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Sheet.Content className="flex-auto overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 blk:space-y-5">
              <Form.Field
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Name</Form.Label>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="description"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Description</Form.Label>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="size"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Size</Form.Label>
                    <CurrencyField.ValueInput {...field} />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="type"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Type</Form.Label>
                    <SelectUsageType
                      value={field.value}
                      onValueChange={field.onChange}
                      inForm
                    />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="tenureType"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Tenure Type</Form.Label>
                    <SelectTenureType
                      value={field.value}
                      onValueChange={field.onChange}
                      inForm
                    />
                  </Form.Item>
                )}
              />

              <Form.Field
                name="price"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Price</Form.Label>
                    <CurrencyField.ValueInput {...field} />
                  </Form.Item>
                )}
              />

              <div className="space-y-2">
                <Label asChild>
                  <legend>Prices</legend>
                </Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      <Form.Field
                        name={`prices.${index}.currency`}
                        render={({ field }) => (
                          <Form.Item>
                            <CurrencyField.SelectCurrency
                              {...field}
                              display="code"
                            />
                          </Form.Item>
                        )}
                      />
                      <Form.Field
                        name={`prices.${index}.price`}
                        render={({ field }) => (
                          <Form.Item className="col-span-2">
                            <CurrencyField.ValueInput {...field} />
                          </Form.Item>
                        )}
                      />
                      <Form.Field
                        name={`prices.${index}.priceType`}
                        render={({ field }) => (
                          <Form.Item>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <Form.Control>
                                <Select.Trigger className="h-8">
                                  <Select.Value placeholder="Price type" />
                                </Select.Trigger>
                              </Form.Control>
                              <Select.Content>
                                <Select.Item value="priceBySize">
                                  per m²
                                </Select.Item>
                                <Select.Item value="priceByUnit">
                                  per unit
                                </Select.Item>
                              </Select.Content>
                            </Select>
                          </Form.Item>
                        )}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20"
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
                  onClick={() =>
                    append({
                      currency: '',
                      price: 0,
                      priceType: 'priceBySize',
                    })
                  }
                  type="button"
                >
                  <IconPlus className="mr-2 h-4 w-4" /> Add Price
                </Button>
              </div>

              <Form.Field
                name="content"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Content</Form.Label>
                    <Editor
                      isHTML
                      initialContent={field.value}
                      onChange={field.onChange}
                    />
                  </Form.Item>
                )}
              />
            </div>
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer className="flex-none">
          <Sheet.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Sheet.Close>
          <Button type="submit" disabled={loading}>
            <Spinner show={loading} />
            Update unit type
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
