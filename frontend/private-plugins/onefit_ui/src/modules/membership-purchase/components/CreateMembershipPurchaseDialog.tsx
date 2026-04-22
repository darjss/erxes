import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Label,
  Select,
  Spinner,
} from 'erxes-ui';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ONE_FIT_ACTIVE_MEMBERSHIP_PLANS,
  ONE_FIT_MEMBERSHIP_PLAN,
} from '~/modules/membership/graphql/membershipPlanQueries';
import { OneFitMembershipPlan } from '~/modules/membership/types/membership';
import { ONE_FIT_CUSTOMER } from '~/modules/onefitCustomer/graphql/onefitCustomerQueries';
import { SelectOneFitCustomer } from '~/modules/onefitCustomer/components/SelectOneFitCustomer';
import { useCreateMembershipPurchase } from '../hooks/useMembershipPurchaseMutations';

const createMembershipPurchaseSchema = z.object({
  userId: z.string().min(1, { message: 'Customer is required' }),
  planId: z.string().min(1, { message: 'Membership plan is required' }),
  promoCode: z.string().optional(),
  removePreviousCredits: z.boolean().optional(),
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
      promoCode: '',
      removePreviousCredits: false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        userId: defaultUserId || '',
        planId: '',
        promoCode: '',
        removePreviousCredits: false,
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

  const userId = form.watch('userId');
  const { data: customerData, loading: customerLoading } = useQuery(
    ONE_FIT_CUSTOMER,
    {
      variables: { _id: userId },
      skip: !userId,
    },
  );
  const oneFitCustomer = customerData?.oneFitCustomer;
  const currentPlanId = oneFitCustomer?.oneFitMembershipPlanId;
  const { data: currentPlanData } = useQuery(ONE_FIT_MEMBERSHIP_PLAN, {
    variables: { _id: currentPlanId || '' },
    skip: !currentPlanId,
  });
  const currentPlanName = currentPlanId
    ? (currentPlanData?.oneFitMembershipPlan?.name ?? '…')
    : 'None';

  const creditBalance = oneFitCustomer?.oneFitCurrentCreditBalance ?? 0;
  const canClearCredits = creditBalance > 0;

  useEffect(() => {
    if (!canClearCredits && form.getValues('removePreviousCredits')) {
      form.setValue('removePreviousCredits', false);
    }
  }, [canClearCredits, form]);

  const { createMembershipPurchase, loading } = useCreateMembershipPurchase();

  function handleClose() {
    setOpen(false);
    form.reset({
      userId: defaultUserId || '',
      planId: '',
      promoCode: '',
      removePreviousCredits: false,
    });
  }

  function onSubmit(values: CreateMembershipPurchaseFormData) {
    createMembershipPurchase({
      variables: {
        userId: values.userId,
        planId: values.planId,
        ...(values.promoCode?.trim() && { promoCode: values.promoCode.trim() }),
        ...(values.removePreviousCredits &&
          canClearCredits && { removePreviousCredits: true }),
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

            {userId ? (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm space-y-2">
                <div className="font-medium">Current membership</div>
                {customerLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Spinner show />
                    Loading customer…
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Plan</div>
                      <div className="font-medium">{currentPlanName}</div>
                      <div className="text-muted-foreground">Credits</div>
                      <div className="font-medium">{creditBalance}</div>
                      {oneFitCustomer?.oneFitMembershipStatus ? (
                        <>
                          <div className="text-muted-foreground">Status</div>
                          <div className="font-medium">
                            {oneFitCustomer.oneFitMembershipStatus}
                          </div>
                        </>
                      ) : null}
                      {oneFitCustomer?.oneFitMembershipExpiresAt ? (
                        <>
                          <div className="text-muted-foreground">Expires</div>
                          <div className="font-medium">
                            {new Date(
                              oneFitCustomer.oneFitMembershipExpiresAt,
                            ).toLocaleString()}
                          </div>
                        </>
                      ) : null}
                    </div>
                    <Form.Field
                      control={form.control}
                      name="removePreviousCredits"
                      render={({ field }) => (
                        <Form.Item className="flex flex-row items-start gap-2 pt-2 border-t mt-2">
                          <Checkbox
                            checked={Boolean(field.value)}
                            onCheckedChange={(v) => field.onChange(v === true)}
                            disabled={!canClearCredits}
                          />
                          <div className="space-y-1">
                            <Label className="font-normal leading-snug cursor-pointer">
                              When this purchase is activated, clear existing
                              credits first, then grant this plan&apos;s
                              credits.
                            </Label>
                            {!canClearCredits ? (
                              <p className="text-xs text-muted-foreground">
                                No credits to clear.
                              </p>
                            ) : null}
                            <Form.Message />
                          </div>
                        </Form.Item>
                      )}
                    />
                  </>
                )}
              </div>
            ) : null}

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

            <Form.Field
              control={form.control}
              name="promoCode"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Promo code</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Enter promo code (optional)"
                      value={field.value ?? ''}
                    />
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
                  {form.watch('promoCode')?.trim() && (
                    <>
                      <div className="text-muted-foreground col-span-2">
                        Promo will be applied at checkout
                      </div>
                    </>
                  )}
                  <div className="text-muted-foreground">Credits</div>
                  <div className="font-medium">{selectedPlan.creditAmount}</div>
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-medium">
                    {selectedPlan.duration} days
                  </div>
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
