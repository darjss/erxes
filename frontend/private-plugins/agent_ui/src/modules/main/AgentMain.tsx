import { AgentDeployScreen } from '../deploy/components/AgentDeployScreen';
import { SERVER_STATUSES } from '../deploy/constants';
import { useAgent } from './hooks/useAgent';
import { Card, Skeleton } from 'erxes-ui';
import { AgentDetailsLayout } from '../detail/components/AgentDetailsLayout';

export const AgentMain = () => {
  const { agent, loading } = useAgent();

  if (loading) {
    return <Skeleton className="h-52 w-full rounded-md" />;
  }

  console.log(agent);

  if (!agent || agent.status !== SERVER_STATUSES.APPROVED) {
    return (
      <div className="flex flex-1 overflow-auto p-4">
        <div className="flex flex-col flex-auto justify-center items-center min-h-0 w-full">
          <Card className="w-full max-w-md p-6">
            <AgentDeployScreen />
          </Card>
        </div>
      </div>
    );
  }

  return <AgentDetailsLayout />;
};
