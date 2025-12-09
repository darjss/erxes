import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Spinner,
  Select,
  Textarea,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { EnumCursorDirection, EnumCursorMode } from 'erxes-ui';
import {
  useCreateActivityType,
  useUpdateActivityType,
} from '../hooks/useActivityTypeMutations';
import { GenderRestriction } from '../types/activityType';
import { ONE_FIT_ACTIVITY_TYPE } from '../graphql/activityTypeQueries';
import { SelectCategories } from '~/modules/provider/components/SelectCategories';
import { SelectProviderSearchable } from '~/modules/provider/components/SelectProviderSearchable';

const baseActivityTypeSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  creditCost: z
    .number()
    .min(0, { message: 'Credit cost must be 0 or greater' }),
  duration: z
    .number()
    .min(1, { message: 'Duration must be at least 1 minute' }),
  genderRestriction: z.nativeEnum(GenderRestriction),
  categoryIds: z
    .array(z.string())
    .min(1, { message: 'At least one category is required' }),
  isActive: z.boolean().optional(),
  cancellationDeadline: z
    .number()
    .min(0, { message: 'Cancellation deadline must be 0 or greater' })
    .optional(),
});

const createActivityTypeSchema = baseActivityTypeSchema.extend({
  providerId: z.string().min(1, { message: 'Provider ID is required' }),
});

const editActivityTypeSchema = baseActivityTypeSchema.partial();

type CreateActivityTypeFormData = z.infer<typeof createActivityTypeSchema>;
type EditActivityTypeFormData = z.infer<typeof editActivityTypeSchema>;

interface ActivityTypeDialogProps {
  mode: 'create' | 'edit';
  activityTypeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const ActivityTypeDialog = ({
  mode,
  activityTypeId,
  open,
  onOpenChange,
  onClose,
}: ActivityTypeDialogProps) => {
  const isCreate = mode === 'create';
  const [internalOpen, setInternalOpen] = useState(false);

  const effectiveOpen = open !== undefined ? open : internalOpen;
  const effectiveOnOpenChange =
    onOpenChange || ((newOpen: boolean) => setInternalOpen(newOpen));

  if (isCreate) {
    return (
      <Dialog open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
        <Dialog.Trigger asChild>
          <Button>
            <IconPlus />
            Create Activity Type
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Create Activity Type</Dialog.Title>
          </Dialog.Header>
          <ActivityTypeForm
            mode="create"
            onClose={() => {
              effectiveOnOpenChange(false);
              onClose?.();
            }}
          />
        </Dialog.Content>
      </Dialog>
    );
  }

  return (
    <Dialog open={effectiveOpen} onOpenChange={effectiveOnOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit Activity Type</Dialog.Title>
        </Dialog.Header>
        <ActivityTypeForm
          mode="edit"
          activityTypeId={activityTypeId!}
          onClose={() => {
            effectiveOnOpenChange(false);
            onClose?.();
          }}
        />
      </Dialog.Content>
    </Dialog>
  );
};

interface ActivityTypeFormProps {
  mode: 'create' | 'edit';
  activityTypeId?: string;
  onClose: () => void;
}

const ActivityTypeForm = ({
  mode,
  activityTypeId,
  onClose,
}: ActivityTypeFormProps) => {
  const isCreate = mode === 'create';

  const { data: activityTypeData, loading: queryLoading } = useQuery(
    ONE_FIT_ACTIVITY_TYPE,
    {
      variables: { _id: activityTypeId },
      skip: isCreate || !activityTypeId,
    },
  );

  const activityType = activityTypeData?.oneFitActivityType;

  const form = useForm<CreateActivityTypeFormData | EditActivityTypeFormData>({
    resolver: zodResolver(
      isCreate ? createActivityTypeSchema : editActivityTypeSchema,
    ),
    defaultValues: {
      name: '',
      description: '',
      creditCost: 0,
      duration: 60,
      genderRestriction: GenderRestriction.MIXED,
      categoryIds: [],
      isActive: true,
      cancellationDeadline: 0,
      ...(isCreate && { providerId: '' }),
    },
  });

  useEffect(() => {
    if (!isCreate && activityType) {
      form.reset({
        name: activityType.name,
        description: activityType.description || '',
        creditCost: activityType.creditCost,
        duration: activityType.duration,
        genderRestriction: activityType.genderRestriction,
        categoryIds: activityType.categoryIds || [],
        isActive: activityType.isActive,
        cancellationDeadline: activityType.cancellationDeadline || 0,
      });
    }
  }, [activityType, isCreate, form]);

  const { createActivityType, loading: createLoading } =
    useCreateActivityType();
  const { updateActivityType, loading: updateLoading } =
    useUpdateActivityType();

  const loading = isCreate ? createLoading : updateLoading;

  const onSubmit = (
    data: CreateActivityTypeFormData | EditActivityTypeFormData,
  ) => {
    if (isCreate) {
      const createData = data as CreateActivityTypeFormData;
      createActivityType({
        variables: {
          providerId: createData.providerId,
          name: createData.name,
          description: createData.description || undefined,
          creditCost: createData.creditCost,
          duration: createData.duration,
          genderRestriction: createData.genderRestriction,
          categoryIds: createData.categoryIds,
          isActive:
            createData.isActive !== undefined ? createData.isActive : true,
          cancellationDeadline: createData.cancellationDeadline,
        },
        onCompleted: () => {
          onClose();
          form.reset();
        },
      });
    } else {
      const editData = data as EditActivityTypeFormData;
      updateActivityType({
        variables: {
          _id: activityTypeId!,
          name: editData.name,
          description: editData.description || undefined,
          creditCost: editData.creditCost,
          duration: editData.duration,
          genderRestriction: editData.genderRestriction,
          categoryIds:
            editData.categoryIds && editData.categoryIds.length > 0
              ? editData.categoryIds
              : undefined,
          isActive: editData.isActive,
          cancellationDeadline: editData.cancellationDeadline,
        },
        onCompleted: () => {
          onClose();
        },
      });
    }
  };

  if (!isCreate && queryLoading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {isCreate && (
          <Form.Field
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Provider *</Form.Label>
                <Form.Control>
                  <SelectProviderSearchable.FormItem
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        )}
        <Form.Field
          control={form.control}
          name="name"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Name *</Form.Label>
              <Form.Control>
                <Input {...field} placeholder="Enter activity name" />
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
            name="creditCost"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Credit Cost *</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter credit cost"
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
                <Form.Label>Duration (minutes) *</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    placeholder="Enter duration in minutes"
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
          name="genderRestriction"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Gender Restriction *</Form.Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <Form.Control>
                  <Select.Trigger>
                    <Select.Value placeholder="Select gender restriction" />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  <Select.Item value={GenderRestriction.MIXED}>
                    Mixed
                  </Select.Item>
                  <Select.Item value={GenderRestriction.MALE}>Male</Select.Item>
                  <Select.Item value={GenderRestriction.FEMALE}>
                    Female
                  </Select.Item>
                </Select.Content>
              </Select>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Categories *</Form.Label>
              <Form.Control>
                <SelectCategories
                  selected={field.value || []}
                  onSelect={field.onChange}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="cancellationDeadline"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Cancellation Deadline (hours)</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Hours before activity start when cancellation is allowed"
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
          {!isCreate && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size={isCreate ? 'lg' : 'default'}
            disabled={loading}
          >
            <Spinner show={loading} />
            {isCreate ? 'Create Activity Type' : 'Update Activity Type'}
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};

// Export convenience components for backward compatibility
export const CreateActivityTypeDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <ActivityTypeDialog
      mode="create"
      open={open}
      onOpenChange={setOpen}
      onClose={() => setOpen(false)}
    />
  );
};

export const EditActivityTypeDialog = ({
  activityTypeId,
  open,
  onOpenChange,
  onClose,
}: {
  activityTypeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) => (
  <ActivityTypeDialog
    mode="edit"
    activityTypeId={activityTypeId}
    open={open}
    onOpenChange={onOpenChange}
    onClose={onClose}
  />
);
