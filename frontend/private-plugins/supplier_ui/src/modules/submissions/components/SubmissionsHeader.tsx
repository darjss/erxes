import { Breadcrumb, Button, Separator, Tooltip } from 'erxes-ui';
import { PageHeader } from 'ui-modules';
import { Link } from 'react-router-dom';
import { IconSend } from '@tabler/icons-react';
import { SubmitProductSheet } from './SubmitProductSheet';
import { useGetSupplier } from '../../profile/hooks/useSupplier';

export const SubmissionsHeader = () => {
  const { supplier } = useGetSupplier();
  const isRejected = supplier?.verificationStatus === 'unverified';

  return (
    <PageHeader>
      <PageHeader.Start>
        <Breadcrumb>
          <Breadcrumb.List className="gap-1">
            <Breadcrumb.Item>
              <Button variant="ghost" asChild>
                <Link to="/supplier/submissions">
                  <IconSend />
                  Submissions
                </Link>
              </Button>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb>
        <Separator.Inline />
        <PageHeader.FavoriteToggleButton />
      </PageHeader.Start>
      <PageHeader.End>
        {isRejected ? (
          <Tooltip.Provider>
            <Tooltip>
              <Tooltip.Trigger asChild>
                <span>
                  <SubmitProductSheet
                    trigger={
                      <Button disabled>
                        <IconSend className="mr-1 size-4" />
                        Submit products
                      </Button>
                    }
                  />
                </span>
              </Tooltip.Trigger>
              <Tooltip.Content>
                {supplier?.verificationNote
                  ? `Profile rejected: ${supplier.verificationNote}`
                  : 'Your supplier profile has been rejected.'}
              </Tooltip.Content>
            </Tooltip>
          </Tooltip.Provider>
        ) : (
          <SubmitProductSheet />
        )}
      </PageHeader.End>
    </PageHeader>
  );
};
