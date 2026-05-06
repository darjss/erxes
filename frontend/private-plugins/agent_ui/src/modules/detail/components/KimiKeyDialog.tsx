import { zodResolver } from '@hookform/resolvers/zod';
import { IconKey } from '@tabler/icons-react';
import { AlertDialog, Button, Form, Input, useToast } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSetKimiKey } from '../hooks/useKimiKey';

const formSchema = z.object({
  kimiApiKey: z
    .string()
    .min(1, 'Kimi API key is required')
    .startsWith('sk-', 'Kimi API keys start with "sk-"'),
});

type FormValues = z.infer<typeof formSchema>;

interface KimiKeyDialogProps {
  open: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const KimiKeyDialog = ({
  open,
  onSuccess,
  onCancel,
}: KimiKeyDialogProps) => {
  const { setKey, loading } = useSetKimiKey();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { kimiApiKey: '' },
  });

  const onSubmit = async (values: FormValues) => {
    await setKey(values.kimiApiKey, {
      onCompleted: () => {
        toast({ variant: 'success', title: 'Kimi API key saved' });
        onSuccess();
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          title: 'Failed to save key',
          description: err.message,
        });
      },
    });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialog.Content className="sm:max-w-md">
        <AlertDialog.Header className="flex flex-row gap-3 sm:flex-row">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <IconKey className="text-primary h-5 w-5" />
          </div>
          <div className="flex flex-col gap-2 text-left">
            <AlertDialog.Title className="text-base font-semibold">
              Enter your Kimi API key
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground text-sm">
              Your agent needs a Kimi API key to run. Paste the key below — it
              will be stored on your agent server only.
            </AlertDialog.Description>
          </div>
        </AlertDialog.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Form.Field
              name="kimiApiKey"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Kimi API key</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="sk-kimi-..."
                      autoComplete="off"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <AlertDialog.Footer className="flex gap-2 sm:justify-end">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="min-w-28"
              >
                {loading ? 'Saving...' : 'Save key'}
              </Button>
            </AlertDialog.Footer>
          </form>
        </Form>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
