import {
  Upload,
  UploadProvider,
  UploadRemoveButton,
} from '@/block/components/upload';
import { unitTypeSchema } from '@/unit/constants/unitTypeSchema';
import { useUnitTypeUpdate } from '@/unit/hooks/useUnitTypeUpdate';
import { IUnitType } from '@/unit/types/unitType';
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
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { SelectTenureType } from './SelectTenureType';
import { SelectUsageType } from './SelectUsageType';
import {
  SelectUsageFeatureType,
  SelectUsageSubType,
  SelectUsageTypeRoom,
} from './SelectUsageTypeRoom';

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
      subType: unitType.subType || '',
      featureTypes: unitType.featureTypes || [],
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
      rooms:
        unitType.rooms?.map((r) => ({
          type: r.type,
          count: r.count,
        })) || [],
      roomsCount: unitType.roomsCount || 0,
    },
  });

  const usageType = form.watch('type');

  useEffect(() => {
    form.setValue('subType', '');
    form.setValue('featureTypes', []);
  }, [usageType]);

  const [coverImage, setCoverImage] = useState<string>(
    unitType?.coverImage || '',
  );
  const [images, setImages] = useState<string[]>(unitType?.images || []);
  const [planImages, setPlanImages] = useState<string[]>(
    unitType?.planImages || [],
  );

  const { updateUnitType, loading } = useUnitTypeUpdate({ id: unitType._id });

  const onSubmit = (data: z.infer<typeof unitTypeSchema>) => {
    updateUnitType({
      ...data,
      images,
      planImages,
      coverImage,
      project: id || '',
    });
    onClose();
  };

  const onCoverImageChange = (value?: string[] | string) => {
    if (Array.isArray(value)) {
      setCoverImage(value[0]);
    } else if (typeof value === 'string') {
      setCoverImage(value);
    }
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
              <div className="grid blk:grid-cols-3 gap-3">
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
                  name="subType"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Sub Type</Form.Label>
                      <SelectUsageSubType
                        type={usageType}
                        value={field.value}
                        onValueChange={field.onChange}
                        inForm
                      />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  name="featureTypes"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Feature Type</Form.Label>
                      <SelectUsageFeatureType
                        type={usageType}
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
                  name="size"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Size</Form.Label>
                      <CurrencyField.ValueInput {...field} />
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
              </div>

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
                <Label asChild variant="peer" className="font-medium">
                  <legend>Total room count</legend>
                </Label>
                <Form.Field
                  name={'roomsCount'}
                  render={({ field }) => (
                    <Form.Item>
                      <Input
                        placeholder="Total room count"
                        value={field?.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </Form.Item>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label asChild variant="peer" className="font-medium">
                  <legend>Rooms</legend>
                </Label>

                {roomFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="grid grid-cols-4 gap-2 flex-1">
                      <Form.Field
                        name={`rooms.${index}.type`}
                        render={({ field }) => (
                          <Form.Item className="col-span-3">
                            <SelectUsageTypeRoom
                              type={usageType}
                              value={field.value}
                              onValueChange={field.onChange}
                              inForm
                            />
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
                                field.onChange(Number(e.target.value))
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

              <div className="grid grid-cols-2 gap-3">
                <Form.Field
                  name="description"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Description</Form.Label>
                      <Editor
                        className="blk:h-96"
                        isHTML
                        initialContent={field.value}
                        onChange={field.onChange}
                      />
                    </Form.Item>
                  )}
                />

                <Form.Field
                  name="content"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Content</Form.Label>
                      <Editor
                        className="blk:h-96"
                        isHTML
                        initialContent={field.value}
                        onChange={field.onChange}
                      />
                    </Form.Item>
                  )}
                />
              </div>

              <div className="flex">
                <div className="flex flex-col gap-3">
                  <Label>Cover image</Label>
                  <UploadProvider
                    mode="single"
                    value={coverImage}
                    onValueChange={onCoverImageChange}
                  >
                    <div className="grid grid-cols-6 gap-3">
                      {coverImage ? (
                        <div
                          key={coverImage}
                          className="relative aspect-square bg-muted rounded-lg flex items-center justify-center group"
                        >
                          <img
                            src={readImage(coverImage)}
                            className="size-full absolute inset-0 object-cover rounded-lg"
                            alt="project"
                          />
                          <Dialog>
                            <Dialog.Trigger asChild>
                              <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                            </Dialog.Trigger>
                            <Dialog.Content className="p-0 max-w-screen-xl w-auto border-0 bg-transparent">
                              <img
                                src={readImage(coverImage)}
                                alt="project"
                                className="rounded-lg max-h-[90vh] max-w-[90vw] object-contain mx-auto"
                              />
                              <div className="absolute inset-0 border border-foreground/10 rounded-lg" />
                            </Dialog.Content>
                          </Dialog>
                          <UploadRemoveButton url={coverImage}>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="size-6 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <IconX />
                            </Button>
                          </UploadRemoveButton>
                        </div>
                      ) : (
                        <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <IconPhotoCirclePlus className="size-8 text-scroll" />
                        </div>
                      )}
                      <Upload>
                        <div className="p-2 relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <IconUpload />
                        </div>
                      </Upload>
                    </div>
                  </UploadProvider>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Images</Label>
                  <UploadProvider
                    mode="multiple"
                    value={images}
                    onValueChange={onValueChange}
                  >
                    <div className="grid grid-cols-6 gap-3">
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
                        <div className="p-2 relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <IconUpload />
                        </div>
                      </Upload>
                    </div>
                  </UploadProvider>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Plan images</Label>
                  <UploadProvider
                    mode="multiple"
                    value={planImages}
                    onValueChange={onValuesChange}
                  >
                    <div className="grid grid-cols-6 gap-3">
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
                        <div className="p-2 relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                          <IconUpload />
                        </div>
                      </Upload>
                    </div>
                  </UploadProvider>
                </div>
              </div>
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
