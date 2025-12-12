import {
  Button,
  Checkbox,
  Dialog,
  Form,
  Input,
  Label,
  Spinner,
  Switch,
  Textarea,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateCategory } from '../hooks/useCategoryMutations';
import { SelectCategory } from './SelectCategory';

const createCategorySchema = z.object({
  name: z.object({
    en: z.string().min(1, { message: 'Name (English) is required' }),
    mn: z.string().min(1, { message: 'Name (Mongolian) is required' }),
  }),
  description: z
    .object({
      en: z.string().optional(),
      mn: z.string().optional(),
    })
    .optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
});

type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export const CreateCategoryDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <IconPlus />
          Create Category
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create Category</Dialog.Title>
        </Dialog.Header>
        <CreateCategoryForm onClose={() => setOpen(false)} />
      </Dialog.Content>
    </Dialog>
  );
};

const CreateCategoryForm = ({ onClose }: { onClose: () => void }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'mn'>('en');
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: {
        en: '',
        mn: '',
      },
      description: {
        en: '',
        mn: '',
      },
      parentId: '',
      isActive: true,
    },
  });
  const { createCategory, loading } = useCreateCategory();

  const onSubmit = (data: CreateCategoryFormData) => {
    createCategory({
      variables: {
        name: data.name,
        description:
          data.description && (data.description.en || data.description.mn)
            ? data.description
            : undefined,
        parentId: data.parentId || undefined,
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
        <div className="flex items-center justify-between gap-4 pb-2">
          <Label className="text-sm font-medium">Language</Label>
          <div className="flex items-center gap-3">
            <Label
              htmlFor="language-switch"
              className={`text-sm ${
                selectedLanguage === 'en'
                  ? 'font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              English
            </Label>
            <Switch
              id="language-switch"
              checked={selectedLanguage === 'mn'}
              onCheckedChange={(checked) =>
                setSelectedLanguage(checked ? 'mn' : 'en')
              }
            />
            <Label
              htmlFor="language-switch"
              className={`text-sm ${
                selectedLanguage === 'mn'
                  ? 'font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              Mongolian
            </Label>
          </div>
        </div>
        <Form.Field
          control={form.control}
          name="name.en"
          render={({ field }) => (
            <Form.Item className={selectedLanguage !== 'en' ? 'hidden' : ''}>
              <Form.Label>Name (English) *</Form.Label>
              <Form.Control>
                <Input
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="Enter category name in English"
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="name.mn"
          render={({ field }) => (
            <Form.Item className={selectedLanguage !== 'mn' ? 'hidden' : ''}>
              <Form.Label>Name (Mongolian) *</Form.Label>
              <Form.Control>
                <Input
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="Enter category name in Mongolian"
                />
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
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="description.en"
          render={({ field }) => (
            <Form.Item className={selectedLanguage !== 'en' ? 'hidden' : ''}>
              <Form.Label>Description (English)</Form.Label>
              <Form.Control>
                <Textarea
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="Enter description in English"
                  rows={3}
                />
              </Form.Control>
              <Form.Message />
            </Form.Item>
          )}
        />
        <Form.Field
          control={form.control}
          name="description.mn"
          render={({ field }) => (
            <Form.Item className={selectedLanguage !== 'mn' ? 'hidden' : ''}>
              <Form.Label>Description (Mongolian)</Form.Label>
              <Form.Control>
                <Textarea
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  placeholder="Enter description in Mongolian"
                  rows={3}
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
            Create Category
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};
