import { IconBuildingStore } from '@tabler/icons-react';
import {
  Breadcrumb,
  Button,
  PageContainer,
  Separator,
} from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { CollectivesTable } from '../components/CollectivesTable';
import { CollectiveDetailSheet } from '../components/CollectiveDetailSheet';

export const CollectivesPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/mushop/collectives">
                    <IconBuildingStore />
                    Collectives
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>

      <CollectivesTable />
      <CollectiveDetailSheet />
    </PageContainer>
  );
};

export default CollectivesPage;
