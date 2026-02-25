import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAgentApprove } from '../hooks/useAgentApprove';

const approveFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

type ApproveFormValues = z.infer<typeof approveFormSchema>;

export const AgentPendingForm = () => {
  const { approveAgent, loading } = useAgentApprove();

  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(approveFormSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (data: ApproveFormValues) => {
    approveAgent(data.code);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Form.Field
          name="code"
          render={({ field }) => (
            <Form.Item className="flex-auto">
              <Form.Label>Approve code</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />

        <Button type="submit" disabled={loading}>
          Approve
        </Button>
      </form>
    </Form>
  );
};
