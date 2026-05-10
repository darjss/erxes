import { IconCreditCard } from '@tabler/icons-react';
import { Breadcrumb, Button, PageContainer, PageSubHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { SubscribersFilter } from '../components/SubscribersFilter';
import { SubscribersTable } from '../components/SubscribersTable';
import { SubscriberDetailSheet } from '../components/SubscriberDetailSheet';

export const SubscribersPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/mushop/subscribers">
                    <IconCreditCard />
                    Subscribers
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>

      <PageSubHeader>
        <SubscribersFilter />
      </PageSubHeader>

      <SubscribersTable />

      <SubscriberDetailSheet />
    </PageContainer>
  );
};

export default SubscribersPage;
