import { useAgent } from '../hooks/useAgent';

export const AgentPendingScreen = () => {
  const { agent } = useAgent();

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="font-semibold text-lg">Awaiting Activation</h2>
      <p className="text-gray-500 text-sm">
        Your agent <strong>{agent?.name}</strong> has been approved and is
        waiting to go active.
      </p>
    </div>
  );
};
