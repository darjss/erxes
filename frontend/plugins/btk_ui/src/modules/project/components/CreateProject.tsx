import { Button, Dialog, Form, Input, Spinner, toast } from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateProject } from '../hooks/useCreateProject';
import { useCompanyInfo } from '~/modules/btk/hooks/useCompanyInfo';

export const CreateProject = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Create Project
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create Project</Dialog.Title>
        </Dialog.Header>
        <CreateProjectForm onClose={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog>
  );
};

const CreateProjectForm = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, { message: 'Name is required' }),
      }),
    ),
    defaultValues: {
      name: '',
    },
  });
  const { createProject, loading } = useCreateProject();
  const { companyInfo } = useCompanyInfo();

  const onSubmit = (data: { name: string }) => {
    createProject({
      variables: {
        name: data.name,
        companyId: companyInfo?._id,
      },
      onCompleted: () => {
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
        onClose();
        form.reset();
      },
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Name</Form.Label>
              <Form.Control>
                <Input {...field} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Dialog.Footer>
          <Button type="submit" size="lg" disabled={loading}>
            <Spinner show={loading} />
            Create project
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};
