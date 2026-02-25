import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAgent } from '../hooks/useAgent';
import { useAgentDeploy } from '../hooks/useAgentDeploy';

const nameRegex = /^[a-z]+$/;

const deployFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Server Name is required')
    .regex(nameRegex, 'Only lowercase letters allowed (no spaces or symbols)'),
  token: z.string().min(1, 'Token is required'),
});

type DeployFormValues = z.infer<typeof deployFormSchema>;

export const AgentDeployForm = () => {
  const { refetch } = useAgent();
  const { deployAgent, loading } = useAgentDeploy();
  const { toast } = useToast();

  const form = useForm<DeployFormValues>({
    resolver: zodResolver(deployFormSchema),
    defaultValues: { name: '', token: '' },
  });

  const onSubmit = async (data: DeployFormValues) => {
    try {
      await deployAgent(data.name, data.token);
      await refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: 'destructive',
        title: 'Deploy failed',
        description: message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Deploy agent</h3>
          <p className="text-muted-foreground text-xs">
            Enter your server name and token to deploy.
          </p>
        </div>
        <Form.Field
          name="name"
          render={({ field }) => (
            <Form.Item className="w-full">
              <Form.Label>Server name</Form.Label>
              <Form.Control>
                <Input {...field} className="w-full" />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          name="token"
          render={({ field }) => (
            <Form.Item className="w-full">
              <Form.Label>Discord bot token</Form.Label>
              <Form.Control>
                <Input {...field} className="w-full" />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? 'Deploying...' : 'Deploy'}
        </Button>
      </form>
    </Form>
  );
};
