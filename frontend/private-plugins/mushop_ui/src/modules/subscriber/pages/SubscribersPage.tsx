import { IconCreditCard } from '@tabler/icons-react';
import { Breadcrumb, Button, PageContainer, PageSubHeader, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Can, PageHeader } from 'ui-modules';
import { SubscribersFilter } from '../components/SubscribersFilter';
import { SubscribersTable } from '../components/SubscribersTable';
import { SubscriberDetailSheet } from '../components/SubscriberDetailSheet';
import { GrantSubscriptionSheet } from '../components/GrantSubscriptionSheet';

export const SubscribersPage = () => {
  const { t } = useTranslation('mushop');
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
                    {t('Subscribers')}
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
        <PageHeader.End>
          <Can action="mushopGrantSubscription">
            <GrantSubscriptionSheet />
          </Can>
        </PageHeader.End>
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
