import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Select,
  Spinner,
  Textarea,
} from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  useCreateMembershipPlan,
  useUpdateMembershipPlan,
} from '../hooks/useMembershipPlanMutations';
import { ONE_FIT_MEMBERSHIP_PLAN } from '../graphql/membershipPlanQueries';

const PLAN_TYPE_OPTIONS = [
  { value: 'normal', label: 'Normal (membership + credits)' },
  { value: 'credit', label: 'Credit only' },
] as const;

const membershipPlanSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
    creditAmount: z
      .number()
      .min(0, { message: 'Credit amount must be 0 or greater' }),
    planType: z.enum(['normal', 'credit']),
    duration: z.number().min(1).optional(),
    price: z.number().min(0, { message: 'Price must be 0 or greater' }),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.planType !== 'normal' ||
      (data.duration != null && data.duration >= 1),
    {
      message: 'Duration must be at least 1 day for normal plans',
      path: ['duration'],
    },
  );

type MembershipPlanFormData = z.infer<typeof membershipPlanSchema>;

interface MembershipPlanDialogProps {
  planId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

export function MembershipPlanDialog({
  planId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onClose,
  trigger,
}: MembershipPlanDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditMode = !!planId;
  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? controlledOnOpenChange || (() => {})
    : setInternalOpen;

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && trigger && (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      )}
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>
            {isEditMode ? 'Edit Membership Plan' : 'Create Membership Plan'}
          </Dialog.Title>
        </Dialog.Header>
        <MembershipPlanForm
          planId={planId}
          onClose={handleClose}
          isEditMode={isEditMode}
        />
      </Dialog.Content>
    </Dialog>
  );
}

interface MembershipPlanFormProps {
  planId?: string;
  onClose: () => void;
  isEditMode: boolean;
}

function MembershipPlanForm({
  planId,
  onClose,
  isEditMode,
}: MembershipPlanFormProps) {
  const { data, loading: queryLoading } = useQuery(ONE_FIT_MEMBERSHIP_PLAN, {
    variables: { _id: planId },
    skip: !isEditMode || !planId,
  });

  const plan = data?.oneFitMembershipPlan;

  const form = useForm<MembershipPlanFormData>({
    resolver: zodResolver(membershipPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      creditAmount: 0,
      planType: 'normal',
      duration: 30,
      price: 0,
      isActive: true,
    },
  });

  const planType = form.watch('planType');

  useEffect(() => {
    if (plan && isEditMode) {
      form.reset({
        name: plan.name,
        description: plan.description || '',
        creditAmount: plan.creditAmount,
        planType: (plan.planType as 'normal' | 'credit') || 'normal',
        duration: plan.duration ?? 30,
        price: plan.price,
        isActive: plan.isActive,
      });
    } else if (!isEditMode) {
      form.reset({
        name: '',
        description: '',
        creditAmount: 0,
        planType: 'normal',
        duration: 30,
        price: 0,
        isActive: true,
      });
    }
  }, [plan, isEditMode, form]);

  const { createMembershipPlan, loading: createLoading } =
    useCreateMembershipPlan();
  const { updateMembershipPlan, loading: updateLoading } =
    useUpdateMembershipPlan();
  const loading = createLoading || updateLoading;

  const onSubmit = (data: MembershipPlanFormData) => {
    const variables = {
      name: data.name,
      description: data.description || undefined,
      creditAmount: data.creditAmount,
      planType: data.planType,
      duration:
        data.planType === 'normal' && data.duration != null
          ? data.duration
          : undefined,
      price: data.price,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    if (isEditMode && planId) {
      updateMembershipPlan({
        variables: {
          _id: planId,
          ...variables,
        },
        onCompleted: () => {
          onClose();
        },
      });
    } else {
      createMembershipPlan({
        variables,
        onCompleted: () => {
          onClose();
          form.reset();
        },
      });
    }
  };

  if (isEditMode && queryLoading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

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
              <Form.Label>Name{!isEditMode && ' *'}</Form.Label>
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
        <Form.Field
          control={form.control}
          name="planType"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Plan type</Form.Label>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={field.disabled}
              >
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Select plan type" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {PLAN_TYPE_OPTIONS.map((opt) => (
                    <Select.Item key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
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
                <Form.Label>Credit Amount{!isEditMode && ' *'}</Form.Label>
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
          {planType === 'normal' && (
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
                      value={field.value ?? ''}
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
          )}
        </div>
        <Form.Field
          control={form.control}
          name="price"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Price{!isEditMode && ' *'}</Form.Label>
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
          {isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" size="lg" disabled={loading}>
            <Spinner show={loading} />
            {isEditMode ? 'Update Membership Plan' : 'Create Membership Plan'}
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
}
