import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateMembershipPlan } from '../hooks/useMembershipPlanMutations';

const createMembershipPlanSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  creditAmount: z.number().min(0, { message: 'Credit amount must be 0 or greater' }),
  duration: z.number().min(1, { message: 'Duration must be at least 1 day' }),
  price: z.number().min(0, { message: 'Price must be 0 or greater' }),
  isActive: z.boolean().optional(),
});

type CreateMembershipPlanFormData = z.infer<typeof createMembershipPlanSchema>;

export const CreateMembershipPlanDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Create Membership Plan
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create Membership Plan</Dialog.Title>
        </Dialog.Header>
        <CreateMembershipPlanForm onClose={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog>
  );
};

const CreateMembershipPlanForm = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const form = useForm<CreateMembershipPlanFormData>({
    resolver: zodResolver(createMembershipPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      creditAmount: 0,
      duration: 30,
      price: 0,
      isActive: true,
    },
  });
  const { createMembershipPlan, loading } = useCreateMembershipPlan();

  const onSubmit = (data: CreateMembershipPlanFormData) => {
    createMembershipPlan({
      variables: {
        name: data.name,
        description: data.description || undefined,
        creditAmount: data.creditAmount,
        duration: data.duration,
        price: data.price,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      onCompleted: () => {
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
              <Form.Label>Name *</Form.Label>
              <Form.Control>
                <Input {...field} placeholder="Enter plan name" />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Description</Form.Label>
              <Form.Control>
                <Textarea {...field} placeholder="Enter description" rows={3} />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Form.Field
            control={form.control}
            name="creditAmount"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Credit Amount *</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter credit amount"
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : 0,
                      )
                    }
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="duration"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Duration (days) *</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Enter duration in days"
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : 0,
                      )
                    }
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </div>
        <Form.Field
          control={form.control}
          name="price"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Price *</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : 0,
                    )
                  }
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <Form.Item className="flex flex-row items-center space-x-2 space-y-0">
              <Form.Control>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Form.Control>
              <Form.Label variant="peer">Active</Form.Label>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Dialog.Footer>
          <Button type="submit" size="lg" disabled={loading}>
            <Spinner show={loading} />
            Create Membership Plan
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};








