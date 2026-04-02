import { Badge, cn, Empty } from 'erxes-ui';
import { useAgencyInfo } from '../hooks/useAgencyInfo';
import { IconSparkles } from '@tabler/icons-react';
import { AgencyProfileDashboard } from './AgencyProfileDashboard';
import { AgencyProfileVerificationWindow } from './AgencyProfileVerificationWindow';

export const AgencyProfileDashboardWindow = () => {
  const { agencyInfo } = useAgencyInfo();
  return (
    <div className="flex flex-col gap-6 p-8">
      <div
        className={cn('relative rounded-xl flex flex-col overflow-hidden', {
          'p-4': agencyInfo?.verificationStatus !== 'verified',
        })}
      >
        {agencyInfo?.verificationStatus !== 'verified' && (
          <div className="blk:backdrop-blur-lg absolute inset-0 h-full w-full z-10 flex items-center justify-center">
            <Empty>
              <Empty.Header>
                <Empty.Media variant="icon">
                  <IconSparkles className="text-primary" />
                </Empty.Media>
                <Empty.Title>
                  <Badge variant={'warning'}>Pending</Badge>
                </Empty.Title>
                <Empty.Description>
                  We are currently reviewing your agency information. Dashboard
                  will be unavialable until verification is complete
                </Empty.Description>
              </Empty.Header>
              <Empty.Content>
                <ul className="list-disc list-inside text-xs text-muted-foreground text-left">
                  <li>Your profile will not be visible to the public</li>
                  <li>
                    Your information cannot be modified during this period
                  </li>
                  <li>Verification typically takes 1–2 business days</li>
                  <li>
                    You will receive a notification once the process is complete
                  </li>
                </ul>
              </Empty.Content>
            </Empty>
          </div>
        )}
        <AgencyProfileDashboard />
      </div>
      <AgencyProfileVerificationWindow />
    </div>
  );
};
