import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateProvider } from '../hooks/useProviderMutations';
import { SelectCategories } from './SelectCategories';

const createProviderSchema = z.object({
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

type CreateProviderFormData = z.infer<typeof createProviderSchema>;

export const CreateProviderDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Create Provider
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>Create Provider</Dialog.Title>
        </Dialog.Header>
        <CreateProviderForm onClose={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog>
  );
};

const CreateProviderForm = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<CreateProviderFormData>({
    resolver: zodResolver(createProviderSchema),
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
  const { createProvider, loading } = useCreateProvider();

  const onSubmit = (data: CreateProviderFormData) => {
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

    createProvider({
      variables: {
        businessName: data.businessName,
        description: data.description || undefined,
        location: locationInput,
        contactInfo: contactInfoInput,
        facilities:
          data.facilities && data.facilities.length > 0
            ? data.facilities
            : undefined,
        categoryIds: data.categoryIds,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      onCompleted: () => {
        onClose();
        form.reset();
      },
    });
  };

  return (
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
                <Input {...field} placeholder="Enter business name" />
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
                <Textarea {...field} placeholder="Enter description" rows={3} />
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
                  <Input {...field} placeholder="Enter address" />
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
                    <Input {...field} placeholder="Enter city" />
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
                    <Input {...field} placeholder="Enter district" />
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
                  <Input {...field} placeholder="Enter phone number" />
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
                  <Input {...field} type="email" placeholder="Enter email" />
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
                  <Input {...field} placeholder="Enter website URL" />
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
                />
              </Form.Control>
              <Form.Label variant="peer">Active</Form.Label>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Dialog.Footer>
          <Button type="submit" size="lg" disabled={loading}>
            <Spinner show={loading} />
            Create Provider
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};
