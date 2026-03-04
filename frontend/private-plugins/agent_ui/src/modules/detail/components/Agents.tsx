import { useAgentsList } from '../hooks/useAgentsList';
import { ScrollArea, Spinner } from 'erxes-ui';
import { AgentItem } from './AgentItem';
import { AddAgentTrigger } from './AddAgent';

export const Agents = ({
  selectedId,
  setSelectedId,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) => {
  const { agents, loading } = useAgentsList();

  const mainAgent = {
    id: 'main',
    identity: null,
  };

  return (
    <ScrollArea.Root className="w-full h-full overflow-hidden relative bg-sidebar">
      {loading ? (
        <Spinner />
      ) : (
        <ScrollArea.Viewport className="[&>div]:block!">
          <div className="py-3 px-4 flex flex-col gap-2 w-full overflow-hidden">
            <AgentItem
              key={mainAgent.id}
              {...mainAgent}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            {agents.map((agent) => (
              <AgentItem
                key={agent.id}
                {...agent}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            ))}
            <AddAgentTrigger />
          </div>
        </ScrollArea.Viewport>
      )}

      <ScrollArea.Bar orientation="vertical" />
    </ScrollArea.Root>
  );
};
