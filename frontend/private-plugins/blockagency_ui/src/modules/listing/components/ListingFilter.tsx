import { Filter, PageSubHeader } from 'erxes-ui';

export const ListingFilter = () => {
  return (
    <PageSubHeader>
      <Filter id="block-listing">
        <Filter.Popover>
          <Filter.Trigger />
        </Filter.Popover>
      </Filter>
    </PageSubHeader>
  );
};
