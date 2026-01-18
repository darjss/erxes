import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import { Button, Dialog, Form, Select, Spinner } from 'erxes-ui';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ONE_FIT_ACTIVE_MEMBERSHIP_PLANS } from '~/modules/membership/graphql/membershipPlanQueries';
import { OneFitMembershipPlan } from '~/modules/membership/types/membership';
import { SelectOneFitCustomer } from '~/modules/onefitCustomer/components/SelectOneFitCustomer';
import { useCreateMembershipPurchase } from '../hooks/useMembershipPurchaseMutations';

const createMembershipPurchaseSchema = z.object({
  userId: z.string().min(1, { message: 'Customer is required' }),
  planId: z.string().min(1, { message: 'Membership plan is required' }),
});

type CreateMembershipPurchaseFormData = z.infer<
  typeof createMembershipPurchaseSchema
>;

interface CreateMembershipPurchaseDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultUserId?: string;
}

export function CreateMembershipPurchaseDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultUserId,
}: CreateMembershipPurchaseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen as boolean) : internalOpen;
  const setOpen = isControlled
    ? controlledOnOpenChange || (() => {})
    : setInternalOpen;

  const form = useForm<CreateMembershipPurchaseFormData>({
    resolver: zodResolver(createMembershipPurchaseSchema),
    defaultValues: {
      userId: defaultUserId || '',
      planId: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        userId: defaultUserId || '',
        planId: '',
      });
    }
  }, [defaultUserId, form, open]);

  const { data } = useQuery(ONE_FIT_ACTIVE_MEMBERSHIP_PLANS);
  const plans: OneFitMembershipPlan[] = data?.oneFitActiveMembershipPlans || [];

  const planId = form.watch('planId');
  const selectedPlan = useMemo(() => {
    if (!planId) return undefined;
    return plans.find((p) => p._id === planId);
  }, [planId, plans]);

  const { createMembershipPurchase, loading } = useCreateMembershipPurchase();

  function handleClose() {
    setOpen(false);
    form.reset({
      userId: defaultUserId || '',
      planId: '',
    });
  }

  function onSubmit(values: CreateMembershipPurchaseFormData) {
    createMembershipPurchase({
      variables: {
        userId: values.userId,
        planId: values.planId,
      },
      onCompleted: () => handleClose(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && trigger && (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      )}
      {!isControlled && !trigger && (
        <Dialog.Trigger asChild>
          <Button>
            <IconPlus />
            Create purchase
          </Button>
        </Dialog.Trigger>
      )}
      <Dialog.Content className="max-w-2xl">
        <Dialog.Header>
          <Dialog.Title>Create membership purchase</Dialog.Title>
          <Dialog.Description>
            This will create a purchase and generate a payment invoice.
          </Dialog.Description>
        </Dialog.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Form.Field
              control={form.control}
              name="userId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Customer *</Form.Label>
                  <Form.Control>
                    <SelectOneFitCustomer.FormItem
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                      mode="single"
                      type="erxes"
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            <Form.Field
              control={form.control}
              name="planId"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Membership plan *</Form.Label>
                  <Form.Control>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Select.Trigger>
                        <Select.Value placeholder="Select membership plan" />
                      </Select.Trigger>
                      <Select.Content>
                        {plans.map((plan) => (
                          <Select.Item key={plan._id} value={plan._id}>
                            {plan.name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            {selectedPlan && (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                <div className="font-medium mb-2">Summary</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-medium">
                    {selectedPlan.price.toLocaleString()} MNT
                  </div>
                  <div className="text-muted-foreground">Credits</div>
                  <div className="font-medium">{selectedPlan.creditAmount}</div>
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-medium">{selectedPlan.duration} days</div>
                </div>
              </div>
            )}

            <Dialog.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Spinner show={loading} />
                Create invoice
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}

