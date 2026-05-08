import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAgent } from '../../main/hooks/useAgent';
import { useAgentDeploy } from '../hooks/useAgentDeploy';

const nameRegex = /^[a-z]+$/;
const tokenRegex = /^[A-Za-z0-9+/=]+\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+$/;

const deployFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Server Name is required')
    .regex(nameRegex, 'Only lowercase letters allowed (no spaces or symbols)'),
  token: z
    .string()
    .min(1, 'Token is required')
    .regex(
      tokenRegex,
      'Token must be in Discord bot format (e.g. XXX.XXX.XXX)',
    ),
  kimiApiKey: z
    .string()
    .min(1, 'Kimi API key is required')
    .refine(
      (val) => val === 'erxesVIPcustomers' || val.startsWith('sk-'),
      'Kimi API keys start with "sk-"',
    ),
});

type DeployFormValues = z.infer<typeof deployFormSchema>;

export const AgentDeployForm = () => {
  const { refetch } = useAgent();
  const { deployAgent, loading } = useAgentDeploy();
  const { toast } = useToast();

  const form = useForm<DeployFormValues>({
    resolver: zodResolver(deployFormSchema),
    defaultValues: { name: '', token: '', kimiApiKey: '' },
  });

  const onSubmit = async (data: DeployFormValues) => {
    try {
      await deployAgent(data.name, data.token, data.kimiApiKey);
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
        <Form.Field
          name="kimiApiKey"
          render={({ field }) => (
            <Form.Item className="w-full">
              <Form.Label>Kimi API key</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder="sk-kimi-..."
                  autoComplete="off"
                  className="w-full"
                />
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
