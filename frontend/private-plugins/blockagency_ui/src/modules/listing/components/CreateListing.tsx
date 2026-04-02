import { IconPlus } from '@tabler/icons-react';
import { Button } from 'erxes-ui';
import { useSetAtom } from 'jotai';
import { createListingSheetAtom } from '../states/listing';

export const CreateListing = () => {
  const setOpen = useSetAtom(createListingSheetAtom);
  return (
    <Button onClick={() => setOpen(true)}>
      <IconPlus />
      Add Listing
    </Button>
  );
};
