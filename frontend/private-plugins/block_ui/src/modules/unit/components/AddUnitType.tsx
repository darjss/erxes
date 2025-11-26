import {
  Upload,
  UploadProvider,
  UploadRemoveButton,
} from '@/block/components/upload';
import { unitTypeSchema } from '@/unit/constants/unitTypeSchema';
import { useUnitTypeCreate } from '@/unit/hooks/useUnitTypeCreate';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  IconPhotoCirclePlus,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import {
  Button,
  CurrencyField,
  Dialog,
  Editor,
  Form,
  Input,
  Label,
  readImage,
  ScrollArea,
  Select,
  Sheet,
  Spinner,
} from 'erxes-ui';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { SelectTenureType } from './SelectTenureType';
import { SelectUsageType } from './SelectUsageType';

export const AddUnitType = ({ onClose }: { onClose: () => void }) => {
  const { id } = useParams();
  const form = useForm<z.infer<typeof unitTypeSchema>>({
    resolver: zodResolver(unitTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      size: 0,
      type: '',
      tenureType: '',
      content: '',
      price: 0,
      prices: [],
      status: '',
      rooms: [],
      roomsCount: 0,
    },
  });

  const [images, setImages] = useState<string[]>([]);
  const [planImages, setPlanImages] = useState<string[]>([]);

  const { createUnitType, loading } = useUnitTypeCreate();

  const onSubmit = (data: z.infer<typeof unitTypeSchema>) => {
    createUnitType({
      variables: {
        input: { ...data, images, planImages, project: id || '' },
      },
      onCompleted: () => {
        onClose();
        form.reset();
      },
    });
  };

  const onValueChange = (value?: string[] | string) => {
    if (Array.isArray(value)) {
      setImages(value);
    } else if (typeof value === 'string') {
      setImages((prev) => [...prev, value]);
    }
  };

  const onValuesChange = (value?: string[] | string) => {
    if (Array.isArray(value)) {
      setPlanImages(value);
    } else if (typeof value === 'string') {
      setPlanImages((prev) => [...prev, value]);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'prices',
  });

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control: form.control,
    name: 'rooms',
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

              <div className="space-y-2">
                <Label asChild>
                  <legend>Rooms</legend>
                </Label>
                {roomFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      <Form.Field
                        name={`rooms.${index}.type`}
                        render={({ field }) => (
                          <Form.Item className="col-span-3">
                            <Input placeholder="Room type" {...field} />
                          </Form.Item>
                        )}
                      />
                      <Form.Field
                        name={`rooms.${index}.count`}
                        render={({ field }) => (
                          <Form.Item>
                            <Input
                              type="number"
                              placeholder="Count"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </Form.Item>
                        )}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-8 text-destructive bg-destructive/10 hover:bg-destructive/20"
                      onClick={() => removeRoom(index)}
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
                    appendRoom({
                      type: '',
                      count: 1,
                    })
                  }
                  type="button"
                >
                  <IconPlus className="mr-2 h-4 w-4" /> Add Room
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

              <Label>Images</Label>
              <UploadProvider
                mode="multiple"
                value={images}
                onValueChange={onValueChange}
              >
                <div className="grid gap-3 grid-cols-6">
                  {images.length > 0 ? (
                    images.map((image) => (
                      <div
                        key={image}
                        className="relative aspect-square bg-muted rounded-lg flex items-center justify-center group"
                      >
                        <img
                          src={readImage(image)}
                          className="size-full absolute inset-0 object-cover rounded-lg"
                          alt="project"
                        />
                        <Dialog>
                          <Dialog.Trigger asChild>
                            <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                          </Dialog.Trigger>
                          <Dialog.Content className="p-0 max-w-screen-xl w-auto border-0 bg-transparent">
                            <img
                              src={readImage(image)}
                              alt="project"
                              className="rounded-lg max-h-[90vh] max-w-[90vw] object-contain mx-auto"
                            />
                            <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                          </Dialog.Content>
                        </Dialog>
                        <UploadRemoveButton url={image}>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="size-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconX />
                          </Button>
                        </UploadRemoveButton>
                      </div>
                    ))
                  ) : (
                    <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <IconPhotoCirclePlus className="size-8 text-scroll" />
                    </div>
                  )}
                  <Upload>
                    <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <IconUpload />
                    </div>
                  </Upload>
                </div>
              </UploadProvider>

              <Label>Plan images</Label>
              <UploadProvider
                mode="multiple"
                value={planImages}
                onValueChange={onValuesChange}
              >
                <div className="grid gap-3 grid-cols-6">
                  {planImages.length > 0 ? (
                    planImages.map((image) => (
                      <div
                        key={image}
                        className="relative aspect-square bg-muted rounded-lg flex items-center justify-center group"
                      >
                        <img
                          src={readImage(image)}
                          className="size-full absolute inset-0 object-cover rounded-lg"
                          alt="project"
                        />
                        <Dialog>
                          <Dialog.Trigger asChild>
                            <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                          </Dialog.Trigger>
                          <Dialog.Content className="p-0 max-w-screen-xl w-auto border-0 bg-transparent">
                            <img
                              src={readImage(image)}
                              alt="project"
                              className="rounded-lg max-h-[90vh] max-w-[90vw] object-contain mx-auto"
                            />
                            <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                          </Dialog.Content>
                        </Dialog>
                        <UploadRemoveButton url={image}>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="size-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconX />
                          </Button>
                        </UploadRemoveButton>
                      </div>
                    ))
                  ) : (
                    <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <IconPhotoCirclePlus className="size-8 text-scroll" />
                    </div>
                  )}
                  <Upload>
                    <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <IconUpload />
                    </div>
                  </Upload>
                </div>
              </UploadProvider>
            </div>
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer className="flex-none">
          <Sheet.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Sheet.Close>
          <Button type="submit" disabled={loading}>
            <Spinner show={loading} />
            Add unit type
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};

export const AddUnitTypeSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="secondary">
          <IconPlus className="mr-2 h-4 w-4" />
          Add unit type
        </Button>
      </Sheet.Trigger>
      <Sheet.View>
        <Sheet.Header>
          <Sheet.Title>Add unit type</Sheet.Title>
          <Sheet.Close tabIndex={-1} />
        </Sheet.Header>
        {open && <AddUnitType onClose={() => setOpen(false)} />}
      </Sheet.View>
    </Sheet>
  );
};
