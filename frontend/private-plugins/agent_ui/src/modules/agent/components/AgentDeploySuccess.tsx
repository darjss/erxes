import { Button, useToast } from 'erxes-ui';
import { useAgentDestroy } from '../hooks/useAgentDestroy';

export const AgentDeploySuccess = () => {
  const { destroyAgent, loading: destroyLoading } = useAgentDestroy();
  const { toast } = useToast();

  const onDestroy = async () => {
    try {
      await destroyAgent();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: 'destructive',
        title: 'Destroy failed',
        description: message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <Button
        variant="destructive"
        type="button"
        onClick={onDestroy}
        disabled={destroyLoading}
        className="w-full"
      >
        {destroyLoading ? 'Destroying server...' : 'Destroy server'}
      </Button>
      <h3 className="font-medium text-sm">Agent deployed successfully</h3>
      <p className="text-muted-foreground text-xs">
        Your agent has been deployed successfully. You can use it now with
        discord bot.
      </p>
    </div>
  );
};
