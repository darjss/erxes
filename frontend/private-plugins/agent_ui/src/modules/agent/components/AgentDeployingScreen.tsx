import { useAgent } from '../hooks/useAgent';

export const AgentDeployingScreen = () => {
  const { agent } = useAgent();

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="border-gray-900 border-b-2 rounded-full w-10 h-10 animate-spin" />
      <h2 className="font-semibold text-lg">Deploying your agent...</h2>
      <p className="text-gray-500 text-sm">
        This may take a few minutes. Status: <strong>{agent?.status}</strong>
      </p>
    </div>
  );
};
