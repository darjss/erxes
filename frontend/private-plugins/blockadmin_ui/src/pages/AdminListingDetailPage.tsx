import {
  Breadcrumb,
  Button,
  PageContainer,
  ScrollArea,
  Separator,
} from 'erxes-ui';
import { Link } from 'react-router-dom';
import { IconListDetails } from '@tabler/icons-react';
import { PageHeader } from 'ui-modules';
import { AgenciesBreadcrumb } from '@/agencies/components/AgenciesBreadcrumb';
import { AgenciesSubNav } from '@/agencies/components/AgenciesSubNav';
import { AdminListingDetailProfile } from '@/agencies/listing/components/AdminListingDetailProfile';
import { AdminListingDetailSidebar } from '@/agencies/listing/components/AdminListingDetailSidebar';
import { AdminListingDetailTabs } from '@/agencies/listing/components/AdminListingDetailTabs';
import { useAdminListingDetail } from '@/agencies/listing/hooks/useAdminListingDetail';

const ListingDetailBreadcrumb = () => {
  const { listing } = useAdminListingDetail();
  return (
    <>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Button variant="ghost" asChild>
          <Link to="/blockadmin/agencies/listing">
            <IconListDetails className="text-accent-foreground" />
            Listing
          </Link>
        </Button>
      </Breadcrumb.Item>
      {listing?.title && (
        <>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>{listing.title}</Breadcrumb.Page>
          </Breadcrumb.Item>
        </>
      )}
    </>
  );
};

export const AdminListingDetailPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <AgenciesBreadcrumb>
            <ListingDetailBreadcrumb />
          </AgenciesBreadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>
      <AgenciesSubNav />
      <div className="flex flex-col flex-auto overflow-hidden">
        <AdminListingDetailProfile />
        <div className="flex flex-auto overflow-hidden">
          <AdminListingDetailSidebar />
          <ScrollArea className="flex-auto bg-sidebar">
            <AdminListingDetailTabs />
            <ScrollArea.Bar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </PageContainer>
  );
};
