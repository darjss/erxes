import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Button, Form, Input, Select, Textarea, toast } from 'erxes-ui';
import { useCallback, useEffect } from 'react';
import { Path, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ADDRESS_CITY, ADDRESS_DISTRICT } from '@/supplier/constants/address';
import { SOCIAL_LINKS } from '@/supplier/constants/socialLinks';
import { supplierProfileSchema as collectiveProfileSchema } from '@/supplier/constants/supplierProfileSchema';
import { SupplierEditorField as CollectiveEditorField } from '@/supplier/components/SupplierEditorField';
import { SupplierPhones as CollectivePhones } from '@/supplier/components/SupplierPhones';
import { UploadImage } from '@/supplier/components/upload';
import { useGetCollective } from '../hooks/useCollective';
import { useUpdateCollective } from '../hooks/useUpdateCollective';

const statusVariant = (status?: string) => {
  switch (status) {
    case 'verified':
      return 'success' as const;
    case 'unverified':
      return 'destructive' as const;
    default:
      return 'secondary' as const;
  }
};

export const CollectiveProfileForm = () => {
  const { collective, loading } = useGetCollective();
  const { updateCollective, loading: saving } = useUpdateCollective();

  const collectiveAddress = collective?.address as any;
  const addressDetails =
    collectiveAddress?.details || collectiveAddress?.address;

  const getDefaultValues = useCallback(() => {
    const fallbackSocialLinks = {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
    } as z.infer<typeof collectiveProfileSchema>['socialLinks'];

    return {
      name: collective?.name || '',
      description: collective?.description || '',
      about: collective?.about || '',
      logo: collective?.logo || '',
      coverImage: collective?.coverImage || '',
      website: collective?.website || '',
      registrationNumber: collective?.registrationNumber || '',
      primaryEmail: collective?.primaryEmail || '',
      primaryPhone: collective?.primaryPhone || '',
      phones: collective?.phones || [],
      dateFounded: collective?.dateFounded || '',
      address: {
        details: {
          countryCode: addressDetails?.countryCode || undefined,
          country: addressDetails?.country || undefined,
          postCode: addressDetails?.postCode || undefined,
          city: addressDetails?.city || undefined,
          city_district: addressDetails?.city_district || undefined,
          suburb: addressDetails?.suburb || undefined,
          road: addressDetails?.road || undefined,
          street: addressDetails?.street || undefined,
          building: addressDetails?.building || undefined,
          number: addressDetails?.number || undefined,
          other: addressDetails?.other || undefined,
        },
        location: collectiveAddress?.location
          ? {
              type: collectiveAddress?.location?.type || undefined,
              coordinates:
                collectiveAddress?.location?.coordinates || undefined,
            }
          : undefined,
        short: collectiveAddress?.short || undefined,
      },
      socialLinks: (collective?.socialLinks as any) || fallbackSocialLinks,
    };
  }, [collective, collectiveAddress, addressDetails]);

  const form = useForm<z.infer<typeof collectiveProfileSchema>>({
    resolver: zodResolver(collectiveProfileSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (collective) {
      form.reset(getDefaultValues());
    }
  }, [collective, form, getDefaultValues]);

  const logo = form.watch('logo');
  const coverImage = form.watch('coverImage');
  const city = form.watch('address.details.city');

  const onSubmit = (values: z.infer<typeof collectiveProfileSchema>) => {
    updateCollective({
      variables: { input: values },
      onCompleted: () => {
        toast({ title: 'Saved', description: 'Collective profile updated' });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-6 mx-auto p-6 w-full max-w-lg">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Collective profile</h1>
        <Badge variant={statusVariant(collective?.verificationStatus)}>
          {collective?.verificationStatus || 'pending'}
        </Badge>
      </div>
      {collective?.verificationStatus === 'unverified' &&
        collective?.verificationNote && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <p className="font-medium mb-1">Profile rejected</p>
            <p>{collective.verificationNote}</p>
          </div>
        )}

      <Form {...form}>
        <form
          className="gap-4 grid grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit, (error) => {
            console.log(error);
          })}
        >
          <Form.Field
            name="logo"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Logo</Form.Label>
                <UploadImage
                  value={logo}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  className="size-16"
                />
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="coverImage"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="col-span-2">
                <Form.Label>Cover Image</Form.Label>
                <UploadImage
                  value={coverImage}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  uploaderClassName="w-full"
                  className="w-full aspect-video"
                />
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            name="name"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="col-start-1">
                <Form.Label>Name</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="website"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Website</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="primaryEmail"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Email</Form.Label>
                <Form.Control>
                  <Input type="email" {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="primaryPhone"
            control={form.control}
            render={() => (
              <Form.Item>
                <Form.Label>Phone</Form.Label>
                <CollectivePhones form={form} />
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="dateFounded"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Date Founded</Form.Label>
                <Form.Control>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger>
                      <Select.Value placeholder="Select date" />
                    </Select.Trigger>
                    <Select.Content>
                      {Array.from({ length: 100 }).map((_, index) => (
                        <Select.Item
                          key={index}
                          value={`${new Date().getFullYear() - index}`}
                        >{`${new Date().getFullYear() - index}`}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="registrationNumber"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Registration Number</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="description"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="col-span-2">
                <Form.Label>Description</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <CollectiveEditorField
            control={form.control}
            setValue={form.setValue}
            name="about"
            label="About"
            initialContent={collective?.about}
          />

          <Form.Field
            name="address.details.city"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>City</Form.Label>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('address.details.city_district', '');
                  }}
                >
                  <Form.Control>
                    <Select.Trigger>
                      <Select.Value placeholder="Select city" />
                    </Select.Trigger>
                  </Form.Control>
                  <Select.Content>
                    {ADDRESS_CITY.map((city) => (
                      <Select.Item key={city} value={city}>
                        {city}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="address.details.city_district"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>District</Form.Label>
                <Select
                  key={city}
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  disabled={!city}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select district" />
                  </Select.Trigger>
                  <Select.Content>
                    {ADDRESS_DISTRICT[
                      city as keyof typeof ADDRESS_DISTRICT
                    ]?.map((district) => (
                      <Select.Item key={district.value} value={district.value}>
                        {district.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Field
            name="address.short"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="col-span-2">
                <Form.Label>Address</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />

          <div className="flex flex-col gap-2 col-span-2">
            {SOCIAL_LINKS.map((item: { label: string; value: string }) => (
              <Form.Field
                key={item.value}
                name={
                  `socialLinks.${item.value}` as Path<
                    z.infer<typeof collectiveProfileSchema>
                  >
                }
                control={form.control}
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>{item.label}</Form.Label>
                    <Form.Control>
                      <Input
                        value={(field.value as string) || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="col-span-2 mt-2"
            disabled={saving || !form.formState.isDirty}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
