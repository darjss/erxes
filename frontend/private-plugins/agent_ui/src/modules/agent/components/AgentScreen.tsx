import { Skeleton } from 'erxes-ui';
import { SERVER_STATUSES } from '../constants';
import { useAgent } from '../hooks/useAgent';
import { AgentDeployForm } from './AgentDeployForm';
import { AgentDeployingScreen } from './AgentDeployingScreen';
import { AgentPendingForm } from './AgentPendingForm';
import { useMemo } from 'react';
import { AgentDeploySuccess } from './AgentDeploySuccess';

export const AgentScreen = () => {
  const { agent, loading } = useAgent();

  const isAgentCreatedFiveMinutesAgo = useMemo(() => {
    if (!agent) return false;
    return new Date(agent.createdAt).getTime() > Date.now() - 5 * 60 * 1000;
  }, [agent]);

  if (loading) {
    return <Skeleton className="h-52 w-full rounded-md" />;
  }

  if (!agent) {
    return <AgentPendingForm />;
  }

  if (
    agent?.status === SERVER_STATUSES.DEPLOYING &&
    isAgentCreatedFiveMinutesAgo
  ) {
    return <AgentDeployingScreen />;
  }

  if (agent?.status === SERVER_STATUSES.DEPLOYING) {
    return <AgentPendingForm />;
  }

  if (agent?.status === SERVER_STATUSES.APPROVED) {
    return <AgentDeploySuccess />;
  }

  return <AgentDeploySuccess />;
};
