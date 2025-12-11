import { IconContract } from '@tabler/icons-react';
import { Breadcrumb, Button, PageContainer } from 'erxes-ui';
import { Link } from 'react-router-dom';
import { PageHeader } from 'ui-modules';

export const OpptysLayout = ({ children }: { children: React.ReactNode }) => {
  //   const path = useLocation().pathname;
  //   const isContracts = path.includes('/contracts');
  return (
    <PageContainer>
      <OpptysHeader />
      {children}
      {/* {!(isContracts && process.env.NODE_ENV === 'development') && (
        <div className="blk:backdrop-blur-lg absolute inset-0 h-full w-full z-10 flex items-center justify-center">
          <Empty>
            <Empty.Header>
              <Empty.Media variant="icon">
                <IconSparkles className="text-primary" />
              </Empty.Media>
              <Empty.Title>Enterprise</Empty.Title>
              <Empty.Description>
                Please upgrade to the Enterprise plan to access this feature.
              </Empty.Description>
            </Empty.Header>
          </Empty>
        </div>
      )} */}
    </PageContainer>
  );
};

export const OpptysHeader = () => {
  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/block/opportunities">
                  <IconContract />
                  Opportunities
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
      </PageHeader.Start>
    </PageHeader>
  );
};
