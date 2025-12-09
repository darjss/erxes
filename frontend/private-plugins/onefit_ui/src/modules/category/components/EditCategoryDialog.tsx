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
import { useUpdateCategory } from '../hooks/useCategoryMutations';
import { ONE_FIT_ACTIVITY_CATEGORY } from '../graphql/categoryQueries';
import { SelectCategory } from './SelectCategory';

const editCategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
});

type EditCategoryFormData = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const EditCategoryDialog = ({
  categoryId,
  open,
  onOpenChange,
  onClose,
}: EditCategoryDialogProps) => {
  const { data, loading: queryLoading } = useQuery(ONE_FIT_ACTIVITY_CATEGORY, {
    variables: { _id: categoryId },
    skip: !open,
  });

  const category = data?.oneFitActivityCategory;

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
    }
  }, [category, form]);

  const { updateCategory, loading } = useUpdateCategory();

  const onSubmit = (data: EditCategoryFormData) => {
    updateCategory({
      variables: {
        _id: categoryId,
        name: data.name,
        description: data.description || undefined,
        parentId: data.parentId || undefined,
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
          <Dialog.Title>Edit Category</Dialog.Title>
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
                      <Input {...field} placeholder="Enter category name" />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Parent Category</Form.Label>
                    <Form.Control>
                      <SelectCategory
                        selected={field.value}
                        onSelect={(value) => field.onChange(value || '')}
                        excludeId={categoryId}
                      />
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
                  Update Category
                </Button>
              </Dialog.Footer>
            </form>
          </Form>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

