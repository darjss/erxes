import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAgentApprove } from '../hooks/useAgentApprove';

const approveFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

type ApproveFormValues = z.infer<typeof approveFormSchema>;

export const AgentPendingForm = () => {
  const { approveAgent, loading } = useAgentApprove();
  const { toast } = useToast();

  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(approveFormSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = async (data: ApproveFormValues) => {
    try {
      await approveAgent(data.code);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        variant: 'destructive',
        title: 'Approve failed',
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
          <h3 className="text-sm font-medium">Approve agent</h3>
          <p className="text-muted-foreground text-xs">
            Enter the code sent to you to activate your agent.
          </p>
        </div>
        <Form.Field
          name="code"
          render={({ field }) => (
            <Form.Item className="w-full">
              <Form.Label>Code</Form.Label>
              <Form.Control>
                <Input {...field} className="w-full" />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full mt-1">
          {loading ? 'Approving...' : 'Approve'}
        </Button>
      </form>
    </Form>
  );
};
