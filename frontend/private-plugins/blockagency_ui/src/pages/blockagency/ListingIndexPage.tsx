import { Separator } from 'erxes-ui';
import { ListingKPI } from '~/modules/listing/components/ListingKPI';
import { ListingFilter } from '~/modules/listing/components/ListingFilter';
import { ListingRecordTable } from '~/modules/listing/components/ListingRecordTable';
import { CreateListingSheet } from '~/modules/listing/components/CreateListingSheet';


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
