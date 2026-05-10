import { Button, useToast } from 'erxes-ui';
import { useState } from 'react';
import { DestroyServerDialog } from '~/modules/deploy/components/DestroyServerDialog';
import { RestartServerDialog } from '~/modules/detail/components/RestartServerDialog';
import { useOpencodeDestroy } from '../hooks/useOpencodeDestroy';
import { useOpencodeRestart } from '../../detail/hooks/useOpencodeRestart';

interface OpencodePendingStateProps {
  onRefresh: () => Promise<unknown>;
}

export const OpencodePendingState = ({
  onRefresh,
}: OpencodePendingStateProps) => {
  const [destroyOpen, setDestroyOpen] = useState(false);
  const [restartOpen, setRestartOpen] = useState(false);
  const { destroyOpencode, loading: destroying } = useOpencodeDestroy();
  const { restart, loading: restarting } = useOpencodeRestart();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Provisioning opencode</h3>
        <p className="text-muted-foreground text-xs">
          Your server is being prepared. This can take a few minutes before the
          iframe is ready.
        </p>
      </div>

      <Button
        type="button"
        onClick={() => void onRefresh()}
        variant="outline"
        className="w-full"
      >
        Refresh status
      </Button>

      <Button
        type="button"
        onClick={() => setRestartOpen(true)}
        variant="outline"
        disabled={restarting}
        className="w-full"
      >
        {restarting ? 'Restarting...' : 'Restart provisioning'}
      </Button>

      <Button
        variant="destructive"
        type="button"
        onClick={() => setDestroyOpen(true)}
        disabled={destroying}
        className="w-full"
      >
        Destroy server
      </Button>

      <RestartServerDialog
        open={restartOpen}
        onOpenChange={setRestartOpen}
        onConfirm={() => {
          restart({
            onCompleted: () =>
              toast({
                variant: 'success',
                title: 'Restarted',
                description: 'Provisioning restart requested.',
              }),
            onError: (error) =>
              toast({
                title: 'Restart failed',
                description: error.message,
                variant: 'destructive',
              }),
          });
        }}
        loading={restarting}
        title="Restart opencode provisioning?"
        description="This will restart your opencode server setup. Use this if the workspace has been provisioning for too long."
      />

      <DestroyServerDialog
        open={destroyOpen}
        onOpenChange={setDestroyOpen}
        onConfirm={async () => {
          try {
            await destroyOpencode();
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            toast({
              variant: 'destructive',
              title: 'Destroy failed',
              description: message,
            });
          }
        }}
        loading={destroying}
        title="Destroy opencode server?"
        description="This will permanently remove your opencode workspace server. The current workspace URL and credentials will stop working."
        onAfterConfirm={() => {
          void onRefresh();
        }}
      />
    </div>
  );
};
