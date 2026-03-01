import { IconSparkles } from '@tabler/icons-react';
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

  if (!loading && agents.length === 0) {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-center items-center text-accent-foreground p-4">
        <div className="border border-dashed p-6 bg-sidebar rounded-xl">
          <IconSparkles className="size-8 text-muted-foreground" />
        </div>
        <span className="text-sm text-center">
          No agents yet. Add an agent to get started.
        </span>
      </div>
    );
  }

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
