import { SERVER_STATUSES } from '../constants';
import { useAgent } from '../hooks/useAgent';
import { AgentDeployForm } from './AgentDeployForm';
import { AgentDeployingScreen } from './AgentDeployingScreen';
import { AgentPendingForm } from './AgentPendingForm';
import { AgentPendingScreen } from './AgentPendingScreen';

export const AgentScreen = () => {
  const { agent } = useAgent();

  if (!agent) {
    return <AgentDeployForm />;
  }

  if (agent?.status === SERVER_STATUSES.DEPLOYING) {
    return <AgentDeployingScreen />;
  }

  if (agent?.status === SERVER_STATUSES.PENDING) {
    return <AgentPendingForm />;
  }

  if (agent?.status === SERVER_STATUSES.APPROVED) {
    return <AgentPendingScreen />;
  }

  return <div>AgentScreen</div>;
};
