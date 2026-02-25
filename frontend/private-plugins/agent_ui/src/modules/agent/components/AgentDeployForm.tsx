import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAgentDeploy } from '../hooks/useAgentDeploy';

const deployFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  token: z.string().min(1, 'Token is required'),
});

type DeployFormValues = z.infer<typeof deployFormSchema>;

export const AgentDeployForm = () => {
  const { deployAgent, loading } = useAgentDeploy();

  const form = useForm<DeployFormValues>({
    resolver: zodResolver(deployFormSchema),
    defaultValues: { name: '', token: '' },
  });

  const onSubmit = (data: DeployFormValues) => {
    deployAgent(data.name, data.token);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form.Field
          name="name"
          render={({ field }) => (
            <Form.Item className="flex-auto">
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          name="token"
          render={({ field }) => (
            <Form.Item className="flex-auto">
              <Form.Label>Token</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Deploying...' : 'Deploy'}
        </Button>
      </form>
    </Form>
  );
};