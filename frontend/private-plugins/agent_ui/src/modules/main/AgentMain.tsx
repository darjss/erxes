import { useAgent } from './hooks/useAgent';

export const AgentMain = () => {
  const { agent, loading } = useAgent();

  return <div>AgentMain</div>;
};
