import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useUpdateMembershipPlan } from '../hooks/useMembershipPlanMutations';
import { ONE_FIT_MEMBERSHIP_PLAN } from '../graphql/membershipPlanQueries';

const editMembershipPlanSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  description: z.string().optional(),
  creditAmount: z.number().min(0).optional(),
  duration: z.number().min(1).optional(),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

type EditMembershipPlanFormData = z.infer<typeof editMembershipPlanSchema>;

interface EditMembershipPlanDialogProps {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const EditMembershipPlanDialog = ({
  planId,
  open,
  onOpenChange,
  onClose,
}: EditMembershipPlanDialogProps) => {
  const { data, loading: queryLoading } = useQuery(ONE_FIT_MEMBERSHIP_PLAN, {
    variables: { _id: planId },
    skip: !open,
  });

  const plan = data?.oneFitMembershipPlan;

  const form = useForm<EditMembershipPlanFormData>({
    resolver: zodResolver(editMembershipPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      creditAmount: 0,
      duration: 30,
      price: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        description: plan.description || '',
        creditAmount: plan.creditAmount,
        duration: plan.duration,
        price: plan.price,
        isActive: plan.isActive,
      });
    }
  }, [plan, form]);

  const { updateMembershipPlan, loading } = useUpdateMembershipPlan();

  const onSubmit = (data: EditMembershipPlanFormData) => {
    updateMembershipPlan({
      variables: {
        _id: planId,
        name: data.name,
        description: data.description || undefined,
        creditAmount: data.creditAmount,
        duration: data.duration,
        price: data.price,
        isActive: data.isActive,
      },
      onCompleted: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit Membership Plan</Dialog.Title>
        </Dialog.Header>
        {queryLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
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
                      <Form.Label>Credit Amount</Form.Label>
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
                      <Form.Label>Duration (days)</Form.Label>
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
                    <Form.Label>Price</Form.Label>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Spinner show={loading} />
                  Update Membership Plan
                </Button>
              </Dialog.Footer>
            </form>
          </Form>
        )}
      </Dialog.Content>
    </Dialog>
  );
};








