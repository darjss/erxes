import { IconCreditCard } from '@tabler/icons-react';
import { Breadcrumb, Button, PageSubHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { SubscribersFilter } from '../components/SubscribersFilter';
import { SubscribersTable } from '../components/SubscribersTable';
import { SubscriberDetailSheet } from '../components/SubscriberDetailSheet';

export const SubscribersPage = () => {
  return (
    <div className="flex flex-col h-full">
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

      <div className="flex-1 overflow-auto">
        <SubscribersTable />
      </div>

      <SubscriberDetailSheet />
    </div>
  );
};

export default SubscribersPage;
