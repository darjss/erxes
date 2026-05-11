import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  Input,
  Sheet,
  Textarea,
  useToast,
} from 'erxes-ui';
import { IconBuilding, IconSettings } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DestroyServerDialog } from '~/modules/deploy/components/DestroyServerDialog';
import { useDeleteIdentifier } from '../hooks/useDeleteAssistantOrg';
import type { Identifier } from '../hooks/useAssistantOrgs';
import { useUpdateIdentifier } from '../hooks/useUpdateAssistantOrg';

const assistantOrgSchema = z.object({
  name: z.string().min(1, 'Server name is required'),
  description: z.string().optional(),
});

type AssistantOrgValues = z.infer<typeof assistantOrgSchema>;

interface Props {
  org: Identifier;
}

export const AssistantOrgManageSheet = ({ org }: Props) => {
  const { toast } = useToast();
  const { updateIdentifier, loading: updating } = useUpdateIdentifier();
  const { deleteIdentifier, loading: deleting } = useDeleteIdentifier();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const kindLabel =
    org.kind === 'assistant'
      ? 'AI Assistant'
      : org.kind === 'agent'
        ? 'AI Agent'
        : 'Identifier';
  const editTitle =
    org.kind === 'assistant'
      ? 'Edit Assistant'
      : org.kind === 'agent'
        ? 'Edit Agent'
        : 'Edit Identifier';
  const serverNamePlaceholder =
    org.kind === 'assistant' ? 'Support Assistant' : 'Frontend Agent';
  const deleteTitle =
    org.kind === 'assistant'
      ? 'Delete AI assistant?'
      : org.kind === 'agent'
        ? 'Delete AI agent?'
        : 'Delete identifier?';
  const deleteDescription =
    org.kind === 'assistant'
      ? 'This will permanently remove this AI assistant identifier from the workspace. This action cannot be undone.'
      : org.kind === 'agent'
        ? 'This will permanently remove this AI agent identifier from the workspace. This action cannot be undone.'
        : 'This will permanently remove this identifier from the workspace. This action cannot be undone.';
  const deleteLabel =
    org.kind === 'assistant'
      ? 'Delete AI Assistant'
      : org.kind === 'agent'
        ? 'Delete AI Agent'
        : 'Delete Identifier';
  const deletingLabel =
    org.kind === 'assistant'
      ? 'Deleting AI Assistant...'
      : org.kind === 'agent'
        ? 'Deleting AI Agent...'
        : 'Deleting Identifier...';

  const form = useForm<AssistantOrgValues>({
    resolver: zodResolver(assistantOrgSchema),
    defaultValues: {
      name: org.name,
      description: org.description || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: org.name,
      description: org.description || '',
    });
  }, [form, open, org.description, org.name]);

  const onSubmit = async (values: AssistantOrgValues) => {
    await updateIdentifier(
      org._id,
      {
        name: values.name,
        description: values.description?.trim() || '',
      },
      {
        onCompleted: () => {
          toast({ variant: 'success', title: 'Identifier updated' });
          setOpen(false);
        },
        onError: (error) =>
          toast({
            variant: 'destructive',
            title: 'Update failed',
            description: error.message,
          }),
      },
    );
  };

  const onDelete = async () => {
    await deleteIdentifier(org._id, {
      onCompleted: () => {
        toast({ variant: 'success', title: `${kindLabel} deleted` });
        setDeleteOpen(false);
        setOpen(false);
      },
      onError: (error) =>
        toast({
          variant: 'destructive',
          title: 'Delete failed',
          description: error.message,
        }),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <IconSettings className="h-4 w-4" />
          Manage
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0 md:w-[calc(100vw-theme(spacing.4))] sm:max-w-xl">
        <Form {...form}>
          <form
            className="flex h-full flex-col gap-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Sheet.Header>
              <IconBuilding />
              <Sheet.Title>{editTitle}</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>

            <Sheet.Content className="flex min-h-0 flex-1 flex-col gap-5 px-5 py-5">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">{kindLabel}</h3>
                <p className="text-xs text-muted-foreground">
                  Update the server name and description for this {org.kind === 'assistant' ? 'assistant' : org.kind === 'agent' ? 'agent' : 'identifier'}.
                </p>
              </div>
              <Form.Field
                name="name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Server name</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        autoComplete="off"
                        placeholder={serverNamePlaceholder}
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="description"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Description</Form.Label>
                    <Form.Control>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        rows={5}
                        className="resize-none"
                        placeholder="What this identifier is used for"
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </Sheet.Content>

            <Sheet.Footer>
              <div className="flex w-full items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={updating || deleting}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updating || deleting}
                    onClick={() => {
                      form.reset({
                        name: org.name,
                        description: org.description || '',
                      });
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updating || deleting}>
                    {updating ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </Sheet.Footer>
          </form>
        </Form>
        <DestroyServerDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={onDelete}
          loading={deleting}
          title={deleteTitle}
          description={deleteDescription}
          confirmLabel={deleteLabel}
          loadingLabel={deletingLabel}
          onAfterConfirm={() => setOpen(false)}
        />
      </Sheet.View>
    </Sheet>
  );
};
