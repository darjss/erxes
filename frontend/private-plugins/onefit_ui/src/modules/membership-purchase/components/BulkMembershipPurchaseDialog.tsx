import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Select,
  Spinner,
  toast,
} from 'erxes-ui';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ONE_FIT_CUSTOMERS_BY_COMPANY_ID } from '~/modules/credit/graphql/companyQueries';
import { SelectCompany } from '~/modules/credit/components/SelectCompany';
import { ONE_FIT_ACTIVE_MEMBERSHIP_PLANS } from '~/modules/membership/graphql/membershipPlanQueries';
import { OneFitMembershipPlan } from '~/modules/membership/types/membership';
import { SelectOneFitCustomer } from '~/modules/onefitCustomer/components/SelectOneFitCustomer';
import { useBulkCreateMembershipPurchases } from '../hooks/useMembershipPurchaseMutations';

const bulkMembershipPurchaseSchema = z
  .object({
    companyId: z.string().optional(),
    registerCompanyType: z.enum(['b2b', 'b2c']),
    userIds: z
      .array(z.string())
      .min(1, { message: 'Select at least one customer' }),
    planId: z.string().min(1, { message: 'Membership plan is required' }),
    promoCode: z.string().optional(),
    removePreviousCredits: z.boolean().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.registerCompanyType === 'b2b' && !values.companyId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['companyId'],
        message: 'Company is required for B2B',
      });
    }
  });

type BulkMembershipPurchaseFormData = z.infer<
  typeof bulkMembershipPurchaseSchema
>;

interface IRelatedCustomer {
  _id: string;
  primaryPhone?: string;
  primaryEmail?: string;
}

interface BulkMembershipPurchaseDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function BulkMembershipPurchaseDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: BulkMembershipPurchaseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? (controlledOpen as boolean) : internalOpen;
  const setOpen = isControlled
    ? (controlledOnOpenChange as (open: boolean) => void)
    : setInternalOpen;

  const form = useForm<BulkMembershipPurchaseFormData>({
    resolver: zodResolver(bulkMembershipPurchaseSchema),
    defaultValues: {
      companyId: '',
      registerCompanyType: 'b2b',
      userIds: [],
      planId: '',
      promoCode: '',
      removePreviousCredits: false,
    },
  });

  const companyId = form.watch('companyId');
  const registerCompanyType = form.watch('registerCompanyType');
  const userIds = form.watch('userIds') ?? [];
  const planId = form.watch('planId');

  const { data: customersData, loading: customersLoading } = useQuery(
    ONE_FIT_CUSTOMERS_BY_COMPANY_ID,
    {
      variables: { companyId: companyId || '' },
      skip: registerCompanyType !== 'b2b' || !companyId,
    },
  );
  const relatedCustomers: IRelatedCustomer[] =
    customersData?.oneFitCustomersByCompanyId ?? [];

  const { data: plansData } = useQuery(ONE_FIT_ACTIVE_MEMBERSHIP_PLANS);
  const plans: OneFitMembershipPlan[] =
    plansData?.oneFitActiveMembershipPlans ?? [];
  const selectedPlan = plans.find((plan) => plan._id === planId);

  const filteredRelatedCustomers = useMemo(() => {
    if (!customerSearch.trim()) {
      return relatedCustomers;
    }

    const term = customerSearch.trim().toLowerCase();
    return relatedCustomers.filter((customer) => {
      const phone = (customer.primaryPhone || '').toLowerCase();
      const email = (customer.primaryEmail || '').toLowerCase();
      return phone.includes(term) || email.includes(term);
    });
  }, [customerSearch, relatedCustomers]);

  const { bulkCreateMembershipPurchases, loading: submitLoading } =
    useBulkCreateMembershipPurchases();

  function handleClose() {
    setOpen(false);
    setCustomerSearch('');
    form.reset({
      companyId: '',
      registerCompanyType: 'b2b',
      userIds: [],
      planId: '',
      promoCode: '',
      removePreviousCredits: false,
    });
  }

  function toggleCustomer(customerId: string) {
    const nextUserIds = userIds.includes(customerId)
      ? userIds.filter((id) => id !== customerId)
      : [...userIds, customerId];
    form.setValue('userIds', nextUserIds);
  }

  function selectAllFilteredCustomers() {
    form.setValue(
      'userIds',
      filteredRelatedCustomers.map((customer) => customer._id),
    );
  }

  function clearCustomers() {
    form.setValue('userIds', []);
  }

  function onSubmit(values: BulkMembershipPurchaseFormData) {
    const selectedCount = values.userIds.length;
    const normalizedCompanyId = values.companyId?.trim();
    const variables: Record<string, unknown> = {
      userIds: values.userIds,
      planId: values.planId,
      ...(values.promoCode?.trim() && { promoCode: values.promoCode.trim() }),
      ...(values.removePreviousCredits && { removePreviousCredits: true }),
    };

    if (values.registerCompanyType === 'b2b') {
      variables.companyId = normalizedCompanyId;
    }

    bulkCreateMembershipPurchases({
      variables,
      onCompleted: (data) => {
        const createdCount =
          (data?.oneFitMembershipPurchasesBulkCreate as unknown[])?.length ?? 0;
        const failedCount = Math.max(selectedCount - createdCount, 0);

        if (failedCount > 0) {
          toast({
            title: 'Partial success',
            description: `${createdCount} created, ${failedCount} failed`,
          });
        }

        handleClose();
      },
    });
  }

  const hasCompanyForB2B =
    registerCompanyType === 'b2c' || Boolean(companyId?.trim());
  const isValid = hasCompanyForB2B && Boolean(planId) && userIds.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && trigger && (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      )}
      <Dialog.Content className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>Bulk membership purchase</Dialog.Title>
          <Dialog.Description>
            Select one company, then choose related customers to create
            membership purchases.
          </Dialog.Description>
        </Dialog.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Form.Field
              control={form.control}
              name="registerCompanyType"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Which company to register</Form.Label>
                  <Form.Control>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('userIds', []);
                        form.setValue('companyId', '');
                        setCustomerSearch('');
                      }}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select registration type" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="b2b">B2B</Select.Item>
                        <Select.Item value="b2c">B2C</Select.Item>
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />

            {registerCompanyType === 'b2b' && (
              <Form.Field
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Company *</Form.Label>
                    <Form.Control>
                      <SelectCompany
                        value={field.value ?? ''}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('userIds', []);
                          setCustomerSearch('');
                        }}
                        placeholder="Select company"
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}

            {registerCompanyType === 'b2b' && companyId && (
              <Form.Field
                control={form.control}
                name="userIds"
                render={() => (
                  <Form.Item>
                    <Form.Label>Related customers *</Form.Label>
                    <Input
                      placeholder="Search by phone or email"
                      value={customerSearch}
                      onChange={(event) => setCustomerSearch(event.target.value)}
                      className="mb-2"
                    />
                    <div className="mb-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={selectAllFilteredCustomers}
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearCustomers}
                      >
                        Clear
                      </Button>
                    </div>
                    <Form.Control>
                      <div className="max-h-[220px] space-y-1 overflow-y-auto rounded-md border p-2">
                        {customersLoading ? (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            Loading customers...
                          </div>
                        ) : filteredRelatedCustomers.length === 0 ? (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            {relatedCustomers.length === 0
                              ? 'No customers found for this company.'
                              : 'No matching customers.'}
                          </div>
                        ) : (
                          filteredRelatedCustomers.map((customer) => (
                            <label
                              key={customer._id}
                              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50"
                            >
                              <Checkbox
                                checked={userIds.includes(customer._id)}
                                onCheckedChange={() =>
                                  toggleCustomer(customer._id)
                                }
                              />
                              <span className="text-sm">
                                {customer.primaryPhone ||
                                  customer.primaryEmail ||
                                  customer._id}
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}

            {registerCompanyType === 'b2c' && (
              <Form.Field
                control={form.control}
                name="userIds"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Customers *</Form.Label>
                    <Form.Control>
                      <SelectOneFitCustomer
                        mode="multiple"
                        type="erxes"
                        value={field.value ?? []}
                        onValueChange={(value) =>
                          field.onChange(
                            Array.isArray(value) ? value : [value].filter(Boolean),
                          )
                        }
                      />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            )}

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

            <Form.Field
              control={form.control}
              name="removePreviousCredits"
              render={({ field }) => (
                <Form.Item className="flex flex-row items-start gap-2 rounded-md border p-3">
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                  <div className="space-y-1">
                    <Form.Label className="font-normal leading-snug">
                      When purchases are activated, clear existing credits first,
                      then grant selected plan credits.
                    </Form.Label>
                    <Form.Message />
                  </div>
                </Form.Item>
              )}
            />

            {selectedPlan && (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm">
                <div className="mb-2 font-medium">Summary</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Plan</div>
                  <div className="font-medium">{selectedPlan.name}</div>
                  <div className="text-muted-foreground">Price per user</div>
                  <div className="font-medium">
                    {selectedPlan.price.toLocaleString()} MNT
                  </div>
                  <div className="text-muted-foreground">Users selected</div>
                  <div className="font-medium">{userIds.length}</div>
                </div>
              </div>
            )}

            <Dialog.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || submitLoading}>
                <Spinner show={submitLoading} />
                Create {userIds.length} purchase(s)
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}
