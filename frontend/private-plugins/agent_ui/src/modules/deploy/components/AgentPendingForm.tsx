import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAgentApprove } from '../hooks/useAgentApprove';
import { useAgentDestroy } from '../hooks/useAgentDestroy';
import { DestroyServerDialog } from './DestroyServerDialog';

const approveFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

type ApproveFormValues = z.infer<typeof approveFormSchema>;

export const AgentPendingForm = () => {
  const [destroyOpen, setDestroyOpen] = useState(false);
  const { approveAgent, loading } = useAgentApprove();
  const { destroyAgent, loading: destroyLoading } = useAgentDestroy();
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
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">
        The Discord bot will send you an approve token — this may take 5–10
        minutes. Paste it below to continue.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <Form.Field
            name="code"
            render={({ field }) => (
              <Form.Item className="w-full">
                <Form.Label>Enter discord bot code</Form.Label>
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
      <Button
        variant="destructive"
        type="button"
        onClick={() => setDestroyOpen(true)}
        disabled={destroyLoading}
        className="w-full"
      >
        Destroy server
      </Button>
      <DestroyServerDialog
        open={destroyOpen}
        onOpenChange={setDestroyOpen}
        onConfirm={onDestroy}
        loading={destroyLoading}
      />
    </div>
  );
};
