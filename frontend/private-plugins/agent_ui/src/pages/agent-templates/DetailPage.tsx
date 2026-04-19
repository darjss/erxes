import { useParams } from 'react-router-dom';
import { IconLibrary } from '@tabler/icons-react';
import { Breadcrumb, Button, Separator } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';
import { AgentTemplateDetail } from '~/modules/agent-templates/AgentTemplateDetail';

export const AgentTemplateDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <PageHeader.Start>
          <Breadcrumb>
            <Breadcrumb.List className="gap-1">
              <Breadcrumb.Item>
                <Button variant="ghost" asChild>
                  <Link to="/agent/templates">
                    <IconLibrary />
                    Agents
                  </Link>
                </Button>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Detail</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb>
          <Separator.Inline />
          <PageHeader.FavoriteToggleButton />
        </PageHeader.Start>
      </PageHeader>

      {id && <AgentTemplateDetail agentId={id} />}
    </div>
  );
};
