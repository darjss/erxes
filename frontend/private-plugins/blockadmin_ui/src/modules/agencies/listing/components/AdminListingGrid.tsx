import { Spinner } from 'erxes-ui';
import { useAdminListings } from '../hooks/useAdminListings';
import { AdminListingCard } from './AdminListingCard';
import { AdminListingFilter, IAdminListing } from '../types';

const PER_PAGE = 30;

type Props = {
  filter: AdminListingFilter;
};

export const AdminListingGrid = ({ filter }: Props) => {
  const { list, loading } = useAdminListings({
    variables: { limit: PER_PAGE, ...filter },
  });

  if (loading) {
    return <Spinner containerClassName="py-32" />;
  }

  if (!list.length) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-muted-foreground">
        No listings found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 ba:lg:grid-cols-2 ba:xl:grid-cols-3 gap-6 p-8">
      {list.map((listing: IAdminListing) => (
        <AdminListingCard key={listing._id} {...listing} />
      ))}
    </div>
  );
};
