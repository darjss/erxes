import { IconId } from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  PageContainer,
  ScrollArea,
  Separator,
} from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { AgencyProfileSidebar } from '~/modules/blockagent/components/agency/components/AgencyProfileSidebar';
import { AgencyProfileTabs } from '~/modules/blockagent/components/agency/components/AgencyProfileTabs';
import { AgencyProfileDetailHeader } from '~/modules/blockagent/components/agency/components/AgencyProfileDetailHeader';

export const IndexPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/blockagent">
                    <IconId />
                    Profile
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>
      <div className="flex flex-auto overflow-hidden">
        <AgencyProfileSidebar />
        <div className="flex flex-col flex-auto overflow-hidden">
          <AgencyProfileDetailHeader />
          <ScrollArea className="flex-auto bg-sidebar">
            <AgencyProfileTabs />
            <ScrollArea.Bar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </PageContainer>
  );
};
