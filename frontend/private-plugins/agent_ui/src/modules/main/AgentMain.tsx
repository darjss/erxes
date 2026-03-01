import { AgentDeployScreen } from '../deploy/components/AgentDeployScreen';
import { SERVER_STATUSES } from '../deploy/constants';
import { useAgent } from './hooks/useAgent';
import { Card, Skeleton } from 'erxes-ui';
import { AgentDetailsMain } from '../detail/components/AgentDetailsMain';

export const AgentMain = () => {
  const { agent, loading } = useAgent();

  if (loading) {
    return <Skeleton className="h-52 w-full rounded-md" />;
  }

  if (!agent || agent.status !== SERVER_STATUSES.APPROVED) {
    return (
      <Card className="w-full max-w-md p-6">
        <AgentDeployScreen />
      </Card>
    );
  }

  return <AgentDetailsMain />;
};
