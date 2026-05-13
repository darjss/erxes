import { Badge } from 'erxes-ui';
import {
  ActivityLogCustomActivity,
  ActivityLogs,
  TActivityLog,
} from 'ui-modules';
import { ContractStatus } from '@/contract/types/contractTypes';
import { useBlockContractStatusesByType } from '@/contract-status/hooks/useGetBlockContractStatuses';
import { useParams } from 'react-router-dom';

const CONTRACT_STATUS_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'destructive' | 'info' | 'secondary'
> = {
  [ContractStatus.RESERVED]: 'warning',
  [ContractStatus.DRAFT]: 'secondary',
  [ContractStatus.SIGNED]: 'success',
  [ContractStatus.COMPLETED]: 'success',
  [ContractStatus.CANCELLED]: 'destructive',
};

const StageOrEnumBadge = ({
  value,
  stages,
}: {
  value: string;
  stages: Array<{ type: string; name: string; color?: string; order?: number }>;
}) => {
  const match = stages
    .filter((s) => s.type === value)
    .sort((a, b) => (a.order || 0) - (b.order || 0))[0];

  const variant = CONTRACT_STATUS_VARIANT[value] || 'default';

  if (match) {
    return <Badge variant={variant}>{match.name}</Badge>;
  }
  return <Badge variant={variant}>{value}</Badge>;
};

const StatusActivityRow = ({ activity }: { activity: TActivityLog }) => {
  const { changes, metadata } = activity;
  const fieldLabel = metadata?.fieldLabel || 'Status';
  const prev = changes?.prev?.status as string | undefined;
  const current = changes?.current?.status as string | undefined;

  const { projectId: projectIdParam, id } = useParams<{
    projectId?: string;
    id?: string;
  }>();
  const projectId = projectIdParam || id || '';
  const { statuses = [] } = useBlockContractStatusesByType({ projectId });

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm text-foreground flex flex-row gap-1 flex-wrap items-center">
        <ActivityLogs.ActorName activity={activity} />
        <span className="text-muted-foreground">changed</span>
        <span className="font-medium">{fieldLabel.toLowerCase()}</span>
        {prev && (
          <>
            <span className="text-muted-foreground">from</span>
            <StageOrEnumBadge value={prev} stages={statuses} />
          </>
        )}
        {current && (
          <>
            <span className="text-muted-foreground">to</span>
            <StageOrEnumBadge value={current} stages={statuses} />
          </>
        )}
      </div>
    </div>
  );
};

export const contractStatusActivityLog: ActivityLogCustomActivity = {
  type: 'contract.status_changed',
  render: (activity: TActivityLog) => <StatusActivityRow activity={activity} />,
};
