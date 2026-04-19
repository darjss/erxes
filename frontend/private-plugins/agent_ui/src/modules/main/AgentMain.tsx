import { AgentDeployScreen } from '../deploy/components/AgentDeployScreen';
import { SERVER_STATUSES } from '../deploy/constants';
import { useAgent } from './hooks/useAgent';
import { useFixAndRestart } from '../detail/hooks/useFixAndRestart';
import { Card, Spinner } from 'erxes-ui';
import { IconRefresh } from '@tabler/icons-react';
import { useToast } from 'erxes-ui';
import { AddAgentTrigger } from '../detail/components/AddAgent';
import { RestartServerDialog } from '../detail/components/RestartServerDialog';
import { RestartingOverlay } from '../detail/components/RestartingOverlay';
import { useState, useCallback } from 'react';

export const AgentMain = () => {
  const { agent, loading } = useAgent();
  const { restart, loading: restarting } = useFixAndRestart();
  const { toast } = useToast();
  const [iframeKey, setIframeKey] = useState(0);
  const [restartOpen, setRestartOpen] = useState(false);
  const refreshIframe = useCallback(() => setIframeKey((k) => k + 1), []);

  if (loading) {
    return <Spinner />;
  }

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

  const handleRestartConfirm = () => {
    restart({
      onCompleted: () => {
        toast({ variant: 'success', title: 'Restarted' });
        refreshIframe();
      },
      onError: (error) =>
        toast({
          title: 'Restart failed',
          description: error.message,
          variant: 'destructive',
        }),
    });
  };

  return (
    <div className="relative h-full flex flex-col">
      <RestartingOverlay visible={restarting} />
      <div className="flex items-center justify-start px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRestartOpen(true)}
            disabled={restarting}
            className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-50"
            title="Restart"
          >
            <IconRefresh
              className={`size-4 ${restarting ? 'animate-spin' : ''}`}
            />
          </button>
          <AddAgentTrigger onSuccess={refreshIframe} />
        </div>
      </div>
      <iframe
        key={iframeKey}
        src={`https://${agent.name}.assistant.erxes.io/#token=${agent.token}`}
        title="Agent"
        className="w-full flex-1 border-0 transition-opacity duration-200 opacity-100"
        allow="clipboard-read; clipboard-write; microphone"
      />
      <RestartServerDialog
        open={restartOpen}
        onOpenChange={setRestartOpen}
        onConfirm={handleRestartConfirm}
        loading={restarting}
      />
    </div>
  );
};
