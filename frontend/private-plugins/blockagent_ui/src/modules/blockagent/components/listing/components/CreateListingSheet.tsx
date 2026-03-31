import { useAtom } from 'jotai';
import { createListingSheetAtom } from '../states/listing';
import {
  Button,
  Form,
  InfoCard,
  Input,
  Select,
  Sheet,
  Textarea,
  toast,
} from 'erxes-ui';
import { useListingForm } from '../hooks/useListingForm';
import { useCreateListing } from '../hooks/useCreateListing';
import { useCallback } from 'react';
import { IListing } from '../types/listing';
import { LISTING_TYPES, STATUS_TYPES } from '../constants/listing';
import { ListingLocation } from './ListingLocation';
import { ListingPricing } from './ListingPricing';
import { ListingSpecs } from './ListingSpecs';

export const CreateListingSheet = () => {
  const [open, setOpen] = useAtom(createListingSheetAtom);
  const { form } = useListingForm();
  const { control, handleSubmit, reset } = form;
  const { createListing, loading } = useCreateListing();

  const onSubmit = useCallback(
    async (data: IListing) => {
      try {
        await createListing({ variables: { input: data } });
        toast({ variant: 'success', title: 'Listing created successfully' });
        reset();
        setOpen(false);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to create listing',
          description: error.message,
        });
      }
    },
    [createListing, reset, setOpen],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <Sheet.View className="sm:max-w-7xl">
          <form onSubmit={handleSubmit(onSubmit)} className="contents">
            <Sheet.Header>
              <Sheet.Title>Create Listing</Sheet.Title>
              <Sheet.Description className="sr-only">
                Үл хөдлөхийн мэдээллийг бөглөж, зарыг үүсгэнэ үү.
              </Sheet.Description>
            </Sheet.Header>
            <Sheet.Content className="p-3 px-6 flex-1 overflow-y-auto">
              <div className="flex-1 flex flex-col gap-3">
                <InfoCard title="Basic Information">
                  <InfoCard.Content className="grid grid-cols-3 gap-4">
                    <Form.Field<IListing, 'title'>
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Form.Item className="col-span-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              placeholder="Enter listing title"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field<IListing, 'type'>
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Type</Form.Label>
                          <Form.Control>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <Select.Trigger>
                                <Select.Value placeholder="Select type" />
                              </Select.Trigger>
                              <Select.Content>
                                {LISTING_TYPES.map((t) => (
                                  <Select.Item key={t} value={t}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field<IListing, 'propertyType'>
                      control={control}
                      name="propertyType"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Property Type</Form.Label>
                          <Form.Control>
                            <Input
                              {...field}
                              placeholder="e.g. apartment, house"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field<IListing, 'status'>
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Status</Form.Label>
                          <Form.Control>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <Select.Trigger>
                                <Select.Value placeholder="Select status" />
                              </Select.Trigger>
                              <Select.Content>
                                {STATUS_TYPES.map((s) => (
                                  <Select.Item key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select>
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />

                    <Form.Field<IListing, 'description'>
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Form.Item className="col-span-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control>
                            <Textarea
                              {...field}
                              placeholder="Enter listing description"
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                  </InfoCard.Content>
                </InfoCard>

                <ListingLocation form={form} />

                <ListingPricing form={form} />

                <ListingSpecs form={form} />
              </div>
            </Sheet.Content>
            <Sheet.Footer>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </Sheet.Footer>
          </form>
        </Sheet.View>
      </Form>
    </Sheet>
  );
};
