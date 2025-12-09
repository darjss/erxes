import {
  Button,
  Dialog,
  Form,
  Input,
  Spinner,
  toast,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOneFitCustomerMutations } from '../hooks/useOneFitCustomerMutations';

const updateMembershipSchema = z.object({
  membershipPlanId: z.string().min(1, 'Membership plan ID is required'),
  expiresAt: z.string().min(1, 'Expiration date is required'),
});

type UpdateMembershipFormData = z.infer<typeof updateMembershipSchema>;

interface UpdateMembershipDialogProps {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateMembershipDialog = ({
  customerId,
  open,
  onOpenChange,
}: UpdateMembershipDialogProps) => {
  const form = useForm<UpdateMembershipFormData>({
    resolver: zodResolver(updateMembershipSchema),
    defaultValues: {
      membershipPlanId: '',
      expiresAt: '',
    },
  });

  const { handleUpdateMembership, updatingMembership } =
    useOneFitCustomerMutations();

  const onSubmit = async (data: UpdateMembershipFormData) => {
    try {
      await handleUpdateMembership(
        customerId,
        data.membershipPlanId,
        new Date(data.expiresAt),
      );
      toast({
        title: 'Success',
        description: 'Membership updated successfully',
      });
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update membership',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Update Membership</Dialog.Title>
          <Dialog.Description>
            Update the customer's membership plan and expiration date.
          </Dialog.Description>
        </Dialog.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Form.Field
              control={form.control}
              name="membershipPlanId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Membership Plan ID</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder="Enter membership plan ID" />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      type="datetime-local"
                      placeholder="Select expiration date"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Dialog.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updatingMembership}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatingMembership}>
                <Spinner show={updatingMembership} />
                Update Membership
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

