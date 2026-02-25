import { IconSparkles } from '@tabler/icons-react';
import { Breadcrumb, Button, Card, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { AgentScreen } from '~/modules/agent/components/AgentScreen';

export const IndexPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/settings/agent">
                    <IconSparkles />
                    Agent
                  </Link>
                </Button>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>

      <div className="flex flex-1 overflow-auto p-4">
        <div className="flex flex-col flex-auto justify-center items-center min-h-0 w-full">
          <Card className="w-full max-w-md p-6">
            <AgentScreen />
          </Card>
        </div>
      </div>
    </div>
  );
};
