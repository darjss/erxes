import { Separator } from 'erxes-ui';
import { ListingKPI } from '~/modules/blockagency/components/listing/components/ListingKPI';
import { ListingFilter } from '~/modules/blockagency/components/listing/components/ListingFilter';
import { ListingRecordTable } from '~/modules/blockagency/components/listing/components/ListingRecordTable';
import { CreateListingSheet } from '~/modules/blockagency/components/listing/components/CreateListingSheet';

export const ListingIndexPage = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ListingFilter />
      <ListingKPI />
      <Separator />
      <ListingRecordTable />
      <CreateListingSheet />
    </div>
  );
};
