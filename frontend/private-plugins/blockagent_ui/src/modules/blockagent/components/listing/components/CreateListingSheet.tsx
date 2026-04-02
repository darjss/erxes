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
import { ListingMainInfo } from './ListinMainInfo';
import { ListingMediaAttachments } from './ListingMediaAttachments';

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
                <ListingMainInfo form={form} />

                <ListingLocation form={form} />

                <ListingPricing form={form} />

                <ListingSpecs form={form} />

                <ListingMediaAttachments form={form} />
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
