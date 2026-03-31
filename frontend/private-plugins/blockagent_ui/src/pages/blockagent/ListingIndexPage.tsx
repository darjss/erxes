import { Separator } from 'erxes-ui';
import { ListingKPI } from '~/modules/blockagent/components/listing/components/ListingKPI';
import { ListingFilter } from '~/modules/blockagent/components/listing/components/ListingFilter';
import { ListingRecordTable } from '~/modules/blockagent/components/listing/components/ListingRecordTable';
import { CreateListingSheet } from '~/modules/blockagent/components/listing/components/CreateListingSheet';

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
