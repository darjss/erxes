import {
  Button,
  Checkbox,
  Sheet,
  Form,
  Input,
  Spinner,
  Textarea,
  Switch,
  Label,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  useCreateProvider,
  useUpdateProvider,
} from '../hooks/useProviderMutations';
import { ONE_FIT_PROVIDER } from '../graphql/providerQueries';
import { ProviderStatus } from '../types/provider';
import { SelectCategories } from './SelectCategories';

const baseProviderSchema = z.object({
  businessName: z.object({
    en: z.string().min(1, { message: 'Business name (English) is required' }),
    mn: z.string().min(1, { message: 'Business name (Mongolian) is required' }),
  }),
  description: z
    .object({
      en: z.string().optional(),
      mn: z.string().optional(),
    })
    .optional(),
  location: z.object({
    address: z.object({
      en: z.string().min(1, { message: 'Address (English) is required' }),
      mn: z.string().min(1, { message: 'Address (Mongolian) is required' }),
    }),
    city: z.object({
      en: z.string().min(1, { message: 'City (English) is required' }),
      mn: z.string().min(1, { message: 'City (Mongolian) is required' }),
    }),
    district: z
      .object({
        en: z.string().optional(),
        mn: z.string().optional(),
      })
      .optional(),
    coordinates: z
      .object({
        lat: z.number().optional(),
        lng: z.number().optional(),
      })
      .optional(),
  }),
  contactInfo: z.object({
    phone: z.string().min(1, { message: 'Phone is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    website: z.string().optional(),
  }),
  facilities: z.array(z.string()).optional(),
  categoryIds: z
    .array(z.string())
    .min(1, { message: 'At least one category is required' }),
  isActive: z.boolean().optional(),
});

const createProviderSchema = baseProviderSchema;
const editProviderSchema = baseProviderSchema.partial();

type CreateProviderFormData = z.infer<typeof createProviderSchema>;
type EditProviderFormData = z.infer<typeof editProviderSchema>;

interface ProviderDialogProps {
  mode: 'create' | 'edit';
  providerId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const ProviderDialog = ({
  mode,
  providerId,
  open,
  onOpenChange,
  onClose,
}: ProviderDialogProps) => {
  const isCreate = mode === 'create';
  const [internalOpen, setInternalOpen] = useState(false);

  const effectiveOpen = open !== undefined ? open : internalOpen;
  const effectiveOnOpenChange =
    onOpenChange || ((newOpen: boolean) => setInternalOpen(newOpen));

  if (isCreate) {
    return (
      <Sheet open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
        <Sheet.Trigger asChild>
          <Button>
            <IconPlus />
            Create Provider
          </Button>
        </Sheet.Trigger>
        <Sheet.View className="sm:max-w-2xl">
          <Sheet.Header>
            <Sheet.Title>Create Provider</Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>
          <ProviderForm
            mode="create"
            onClose={() => {
              effectiveOnOpenChange(false);
              onClose?.();
            }}
          />
        </Sheet.View>
      </Sheet>
    );
  }

  return (
    <Sheet open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <Sheet.View className="sm:max-w-2xl">
        <Sheet.Header>
          <Sheet.Title>Edit Provider</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <ProviderForm
          mode="edit"
          providerId={providerId!}
          onClose={() => {
            effectiveOnOpenChange(false);
            onClose?.();
          }}
        />
      </Sheet.View>
    </Sheet>
  );
};

interface ProviderFormProps {
  mode: 'create' | 'edit';
  providerId?: string;
  onClose: () => void;
}

const ProviderForm = ({ mode, providerId, onClose }: ProviderFormProps) => {
  const isCreate = mode === 'create';
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'mn'>('en');

  const { data: providerData, loading: queryLoading } = useQuery(
    ONE_FIT_PROVIDER,
    {
      variables: { _id: providerId },
      skip: isCreate || !providerId,
    },
  );

  const provider = providerData?.oneFitProvider;

  const form = useForm<CreateProviderFormData | EditProviderFormData>({
    resolver: zodResolver(isCreate ? createProviderSchema : editProviderSchema),
    defaultValues: {
      businessName: {
        en: '',
        mn: '',
      },
      description: {
        en: '',
        mn: '',
      },
      location: {
        address: {
          en: '',
          mn: '',
        },
        city: {
          en: '',
          mn: '',
        },
        district: {
          en: '',
          mn: '',
        },
        coordinates: {
          lat: undefined,
          lng: undefined,
        },
      },
      contactInfo: {
        phone: '',
        email: '',
        website: '',
      },
      facilities: [],
      categoryIds: [],
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isCreate && provider) {
      form.reset({
        businessName: provider.businessName || { en: '', mn: '' },
        description: provider.description || { en: '', mn: '' },
        location: {
          address: provider.location?.address || { en: '', mn: '' },
          city: provider.location?.city || { en: '', mn: '' },
          district: provider.location?.district || { en: '', mn: '' },
          coordinates: provider.location?.coordinates
            ? {
                lat: provider.location.coordinates.lat,
                lng: provider.location.coordinates.lng,
              }
            : {
                lat: undefined,
                lng: undefined,
              },
        },
        contactInfo: {
          phone: provider.contactInfo?.phone || '',
          email: provider.contactInfo?.email || '',
          website: provider.contactInfo?.website || '',
        },
        facilities: provider.facilities || [],
        categoryIds: provider.categoryIds || [],
        isActive: provider.isActive,
      });
      setSelectedLanguage('en');
    }
  }, [provider, isCreate, form]);

  const { createProvider, loading: createLoading } = useCreateProvider();
  const { updateProvider, loading: updateLoading } = useUpdateProvider();

  const loading = isCreate ? createLoading : updateLoading;
  const isRejected = !isCreate && provider?.status === ProviderStatus.REJECTED;

  const onSubmit = (data: CreateProviderFormData | EditProviderFormData) => {
    if (isRejected) {
      return;
    }

    const locationInput: any = {
      address: data.location!.address,
      city: data.location!.city,
    };
    if (
      data.location!.district &&
      (data.location!.district.en || data.location!.district.mn)
    ) {
      locationInput.district = data.location!.district;
    }
    if (
      data.location!.coordinates?.lat !== undefined &&
      data.location!.coordinates?.lng !== undefined
    ) {
      locationInput.coordinates = {
        lat: data.location!.coordinates.lat,
        lng: data.location!.coordinates.lng,
      };
    }

    const contactInfoInput: any = {
      phone: data.contactInfo!.phone,
      email: data.contactInfo!.email,
    };
    if (data.contactInfo!.website) {
      contactInfoInput.website = data.contactInfo!.website;
    }

    if (isCreate) {
      const createData = data as CreateProviderFormData;
      createProvider({
        variables: {
          businessName: createData.businessName,
          description:
            createData.description &&
            (createData.description.en || createData.description.mn)
              ? createData.description
              : undefined,
          location: locationInput,
          contactInfo: contactInfoInput,
          facilities:
            createData.facilities && createData.facilities.length > 0
              ? createData.facilities
              : undefined,
          categoryIds: createData.categoryIds,
          isActive:
            createData.isActive !== undefined ? createData.isActive : true,
        },
        onCompleted: () => {
          onClose();
          form.reset();
        },
      });
    } else {
      const editData = data as EditProviderFormData;
      updateProvider({
        variables: {
          _id: providerId!,
          businessName: editData.businessName,
          description:
            editData.description &&
            (editData.description.en || editData.description.mn)
              ? editData.description
              : undefined,
          location: locationInput,
          contactInfo: contactInfoInput,
          facilities:
            editData.facilities && editData.facilities.length > 0
              ? editData.facilities
              : undefined,
          categoryIds: editData.categoryIds,
          isActive: editData.isActive,
        },
        onCompleted: () => {
          onClose();
        },
      });
    }
  };

  if (!isCreate && queryLoading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <Sheet.Content className="flex-auto overflow-y-auto">
          <div className="flex flex-col gap-6 p-5">
            {isRejected && (
              <div className="text-destructive text-sm font-medium">
                Cannot edit a rejected provider
              </div>
            )}
            <div className="flex items-center justify-between gap-4 pb-2">
              <Label className="text-sm font-medium">Language</Label>
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="language-switch"
                  className={`text-sm ${
                    selectedLanguage === 'en'
                      ? 'font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  English
                </Label>
                <Switch
                  id="language-switch"
                  checked={selectedLanguage === 'mn'}
                  onCheckedChange={(checked) =>
                    setSelectedLanguage(checked ? 'mn' : 'en')
                  }
                  disabled={isRejected}
                />
                <Label
                  htmlFor="language-switch"
                  className={`text-sm ${
                    selectedLanguage === 'mn'
                      ? 'font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  Mongolian
                </Label>
              </div>
            </div>
            <Form.Field
              control={form.control}
              name="businessName.en"
              render={({ field }) => (
                <Form.Item
                  className={selectedLanguage !== 'en' ? 'hidden' : ''}
                >
                  <Form.Label>Business Name (English) *</Form.Label>
                  <Form.Control>
                    <Input
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Enter business name in English"
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="businessName.mn"
              render={({ field }) => (
                <Form.Item
                  className={selectedLanguage !== 'mn' ? 'hidden' : ''}
                >
                  <Form.Label>Business Name (Mongolian) *</Form.Label>
                  <Form.Control>
                    <Input
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Enter business name in Mongolian"
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="description.en"
              render={({ field }) => (
                <Form.Item
                  className={selectedLanguage !== 'en' ? 'hidden' : ''}
                >
                  <Form.Label>Description (English)</Form.Label>
                  <Form.Control>
                    <Textarea
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Enter description in English"
                      rows={3}
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="description.mn"
              render={({ field }) => (
                <Form.Item
                  className={selectedLanguage !== 'mn' ? 'hidden' : ''}
                >
                  <Form.Label>Description (Mongolian)</Form.Label>
                  <Form.Control>
                    <Textarea
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="Enter description in Mongolian"
                      rows={3}
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold">Location</h3>
              <Form.Field
                control={form.control}
                name="location.address.en"
                render={({ field }) => (
                  <Form.Item
                    className={selectedLanguage !== 'en' ? 'hidden' : ''}
                  >
                    <Form.Label>Address (English) *</Form.Label>
                    <Form.Control>
                      <Input
                        value={field.value || ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        placeholder="Enter address in English"
                        disabled={isRejected}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="location.address.mn"
                render={({ field }) => (
                  <Form.Item
                    className={selectedLanguage !== 'mn' ? 'hidden' : ''}
                  >
                    <Form.Label>Address (Mongolian) *</Form.Label>
                    <Form.Control>
                      <Input
                        value={field.value || ''}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        placeholder="Enter address in Mongolian"
                        disabled={isRejected}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="location.city.en"
                  render={({ field }) => (
                    <Form.Item
                      className={selectedLanguage !== 'en' ? 'hidden' : ''}
                    >
                      <Form.Label>City (English) *</Form.Label>
                      <Form.Control>
                        <Input
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="Enter city in English"
                          disabled={isRejected}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="location.city.mn"
                  render={({ field }) => (
                    <Form.Item
                      className={selectedLanguage !== 'mn' ? 'hidden' : ''}
                    >
                      <Form.Label>City (Mongolian) *</Form.Label>
                      <Form.Control>
                        <Input
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="Enter city in Mongolian"
                          disabled={isRejected}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="location.district.en"
                  render={({ field }) => (
                    <Form.Item
                      className={selectedLanguage !== 'en' ? 'hidden' : ''}
                    >
                      <Form.Label>District (English)</Form.Label>
                      <Form.Control>
                        <Input
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="Enter district in English"
                          disabled={isRejected}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="location.district.mn"
                  render={({ field }) => (
                    <Form.Item
                      className={selectedLanguage !== 'mn' ? 'hidden' : ''}
                    >
                      <Form.Label>District (Mongolian)</Form.Label>
                      <Form.Control>
                        <Input
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          placeholder="Enter district in Mongolian"
                          disabled={isRejected}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="location.coordinates.lat"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control>
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="Enter latitude"
                          value={field.value || ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                          disabled={isRejected}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="location.coordinates.lng"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control>
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="Enter longitude"
                          value={field.value || ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                          disabled={isRejected}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </div>
            </div>
            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold">Contact Info</h3>
              <Form.Field
                control={form.control}
                name="contactInfo.phone"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        placeholder="Enter phone number"
                        disabled={isRejected}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="contactInfo.email"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Email *</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email"
                        disabled={isRejected}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="contactInfo.website"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Website</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        placeholder="Enter website URL"
                        disabled={isRejected}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
            <Form.Field
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Facilities (comma-separated)</Form.Label>
                  <Form.Control>
                    <Input
                      placeholder="Enter facilities separated by commas"
                      value={field.value?.join(', ') || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? e.target.value
                                .split(',')
                                .map((f) => f.trim())
                                .filter(Boolean)
                            : [],
                        )
                      }
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Categories *</Form.Label>
                  <Form.Control>
                    <SelectCategories
                      selected={field.value || []}
                      onSelect={field.onChange}
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Form.Item className="flex flex-row items-center space-x-2 space-y-0">
                  <Form.Control>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isRejected}
                    />
                  </Form.Control>
                  <Form.Label variant="peer">Active</Form.Label>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        </Sheet.Content>
        <Sheet.Footer>
          {!isCreate && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size={isCreate ? 'lg' : 'default'}
            disabled={loading || isRejected}
          >
            <Spinner show={loading} />
            {isCreate ? 'Create Provider' : 'Update Provider'}
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};

// Export convenience components for backward compatibility
export const CreateProviderDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <ProviderDialog
      mode="create"
      open={open}
      onOpenChange={setOpen}
      onClose={() => setOpen(false)}
    />
  );
};

export const EditProviderDialog = ({
  providerId,
  open,
  onOpenChange,
  onClose,
}: {
  providerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) => (
  <ProviderDialog
    mode="edit"
    providerId={providerId}
    open={open}
    onOpenChange={onOpenChange}
    onClose={onClose}
  />
);
