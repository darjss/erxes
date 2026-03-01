import { IconPlus, IconSparkles } from '@tabler/icons-react';
import { Button, Form, Spinner, Sheet, useToast } from 'erxes-ui';
import { cn } from 'erxes-ui';
import { useCallback, useState } from 'react';
import { useAgentAdd } from '../hooks/useAgentAdd';
import { SubmitHandler } from 'react-hook-form';
import { useAgentForm } from '../hooks/useAgentFormt';
import { AgentForm } from './AgentForm';

export const AddAgentTrigger = () => {
  const { form } = useAgentForm();

  const [open, setOpen] = useState(false);
  const { addAgent, loading } = useAgentAdd();
  const { toast } = useToast();

  const submitHandler: SubmitHandler<any> = useCallback(
    async (data) => {
      addAgent({
        variables: { input: { agentId: data.name, botName: data.name } },
        onCompleted: () => {
          toast({
            variant: 'success',
            title: 'Agent created successfully',
          });
          form.reset({ name: '' });
          setOpen(false);
        },
        onError: (error) =>
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          }),
      });
    },
    [addAgent, toast, form, setOpen],
  );
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => (open ? setOpen(true) : setOpen(false))}
    >
      <Sheet.Trigger asChild>
        <Button
          asChild
          variant="ghost"
          className={cn(
            'justify-start h-auto rounded-lg p-2 items-center overflow-hidden',
          )}
        >
          <div className="flex items-center gap-0 w-full text-left">
            <div
              className={cn(
                'size-8 bg-foreground/5 rounded-full flex-none flex items-center justify-center shrink-0',
              )}
            >
              <IconPlus className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-auto min-w-0 overflow-hidden flex items-center">
              <h4 className={cn('truncate text-sm')}>Add Agent</h4>
            </div>
          </div>
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0">
        <Form {...form}>
          <form
            className="flex flex-col gap-0 size-full"
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <Sheet.Header>
              <IconSparkles />
              <Sheet.Title>Add Agent</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Content className="grow size-full flex flex-col px-5 py-4">
              <AgentForm form={form} />
            </Sheet.Content>
            <Sheet.Footer>
              <Button variant={'secondary'} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : 'Add Agent'}
              </Button>
            </Sheet.Footer>
          </form>
        </Form>
      </Sheet.View>
    </Sheet>
  );
};
