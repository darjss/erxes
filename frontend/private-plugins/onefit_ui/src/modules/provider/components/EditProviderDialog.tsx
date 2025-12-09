import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUpdateProvider } from '../hooks/useProviderMutations';
import { ONE_FIT_PROVIDER } from '../graphql/providerQueries';
import { ProviderStatus } from '../types/provider';
import { SelectCategories } from './SelectCategories';

const editProviderSchema = z.object({
  businessName: z.string().min(1, { message: 'Business name is required' }),
  description: z.string().optional(),
  location: z.object({
    address: z.string().min(1, { message: 'Address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    district: z.string().optional(),
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

type EditProviderFormData = z.infer<typeof editProviderSchema>;

interface EditProviderDialogProps {
  providerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const EditProviderDialog = ({
  providerId,
  open,
  onOpenChange,
  onClose,
}: EditProviderDialogProps) => {
  const { data, loading: queryLoading } = useQuery(ONE_FIT_PROVIDER, {
    variables: { _id: providerId },
    skip: !open,
  });

  const provider = data?.oneFitProvider;

  const form = useForm<EditProviderFormData>({
    resolver: zodResolver(editProviderSchema),
    defaultValues: {
      businessName: '',
      description: '',
      location: {
        address: '',
        city: '',
        district: '',
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
    if (provider) {
      form.reset({
        businessName: provider.businessName,
        description: provider.description || '',
        location: {
          address: provider.location?.address || '',
          city: provider.location?.city || '',
          district: provider.location?.district || '',
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
    }
  }, [provider, form]);

  const { updateProvider, loading } = useUpdateProvider();

  const onSubmit = (data: EditProviderFormData) => {
    if (provider?.status === ProviderStatus.REJECTED) {
      return;
    }

    const locationInput: any = {
      address: data.location.address,
      city: data.location.city,
    };
    if (data.location.district) {
      locationInput.district = data.location.district;
    }
    if (
      data.location.coordinates?.lat !== undefined &&
      data.location.coordinates?.lng !== undefined
    ) {
      locationInput.coordinates = {
        lat: data.location.coordinates.lat,
        lng: data.location.coordinates.lng,
      };
    }

    const contactInfoInput: any = {
      phone: data.contactInfo.phone,
      email: data.contactInfo.email,
    };
    if (data.contactInfo.website) {
      contactInfoInput.website = data.contactInfo.website;
    }

    updateProvider({
      variables: {
        _id: providerId,
        businessName: data.businessName,
        description: data.description || undefined,
        location: locationInput,
        contactInfo: contactInfoInput,
        facilities:
          data.facilities && data.facilities.length > 0
            ? data.facilities
            : undefined,
        categoryIds: data.categoryIds,
        isActive: data.isActive,
      },
      onCompleted: () => {
        onClose();
      },
    });
  };

  const isRejected = provider?.status === ProviderStatus.REJECTED;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>Edit Provider</Dialog.Title>
          {isRejected && (
            <Dialog.Description className="text-destructive">
              Cannot edit a rejected provider
            </Dialog.Description>
          )}
        </Dialog.Header>
        {queryLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <Form.Field
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Business Name *</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        placeholder="Enter business name"
                        disabled={isRejected}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Description</Form.Label>
                    <Form.Control>
                      <Textarea
                        {...field}
                        placeholder="Enter description"
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
                  name="location.address"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>Address *</Form.Label>
                      <Form.Control>
                        <Input
                          {...field}
                          placeholder="Enter address"
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
                    name="location.city"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>City *</Form.Label>
                        <Form.Control>
                          <Input
                            {...field}
                            placeholder="Enter city"
                            disabled={isRejected}
                          />
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={form.control}
                    name="location.district"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>District</Form.Label>
                        <Form.Control>
                          <Input
                            {...field}
                            placeholder="Enter district"
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
              <Dialog.Footer>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || isRejected}>
                  <Spinner show={loading} />
                  Update Provider
                </Button>
              </Dialog.Footer>
            </form>
          </Form>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
