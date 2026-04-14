import { Skeleton } from 'erxes-ui';
import { SERVER_STATUSES } from '../constants';
import { useAgent } from '../../main/hooks/useAgent';
import { AgentDeployForm } from './AgentDeployForm';

import { AgentPendingForm } from './AgentPendingForm';

import { AgentDeploySuccess } from './AgentDeploySuccess';

export const AgentDeployScreen = () => {
  const { agent, loading } = useAgent();

  if (loading) {
    return <Skeleton className="h-52 w-full rounded-md" />;
  }

  console.log(agent);

  if (!agent) {
    return <AgentDeployForm />;
  }

  if (agent?.status === SERVER_STATUSES.DEPLOYING) {
    return <AgentPendingForm createdAt={agent.createdAt} />;
  }

  if (agent?.status === SERVER_STATUSES.APPROVED) {
    return <AgentDeploySuccess />;
  }

  return <AgentDeploySuccess />;
};
