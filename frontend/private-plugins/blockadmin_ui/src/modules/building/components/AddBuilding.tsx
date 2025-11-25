import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import {
  Button,
  Form,
  Input,
  Select,
  Sheet,
  Spinner,
  Textarea,
  toast,
} from 'erxes-ui';
import { UploadImage } from '@/block/components/upload';
import { buildingSchema } from '@/building/constants/buildingSchema';
import { BLOCK_GET_BUILDING_LIST } from '@/building/graphql/buildingQueries';
import { useBuildingsCreate } from '@/building/hooks/useBuildingsCreate';
import { PROJECT_TYPES } from '@/project/constants/project';
import { IProject } from '@/project/types/projectTypes';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddBuilding = ({ project }: { project: IProject }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="secondary">
          <IconPlus />
          Add Building
        </Button>
      </Sheet.Trigger>
      <Sheet.View>
        <Sheet.Header>
          <Sheet.Title>Add Building</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <AddBuildingForProject
          project={project}
          onClose={() => setOpen(false)}
        />
      </Sheet.View>
    </Sheet>
  );
};

export const AddBuildingForProject = ({
  project,
  onClose,
}: {
  project: IProject;
  onClose: () => void;
}) => {
  const form = useForm<z.infer<typeof buildingSchema>>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      type: project.type?.[0] || '',
    },
  });
  const { createBuilding, loading } = useBuildingsCreate();
  const onSubmit = (data: z.infer<typeof buildingSchema>) => {
    createBuilding({
      variables: {
        input: {
          ...data,
          project: project._id,
        },
      },
      refetchQueries: [BLOCK_GET_BUILDING_LIST],
      onCompleted: () => {
        onClose();
        form.reset();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
        });
      },
    });
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col flex-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Sheet.Content className="p-5 space-y-5">
          <Form.Field
            name="coverImage"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Cover Image</Form.Label>
                <UploadImage
                  className="size-16"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                />
              </Form.Item>
            )}
          />
          <Form.Field
            name="name"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Name</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
              </Form.Item>
            )}
          />
          <Form.Field
            name="type"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Type</Form.Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Form.Control>
                    <Select.Trigger className="h-8">
                      <Select.Value placeholder="Select type" />
                    </Select.Trigger>
                  </Form.Control>
                  <Select.Content>
                    {PROJECT_TYPES.map((type) => (
                      <Select.Item key={type.value} value={type.value}>
                        {type.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Item>
            )}
          />
          <Form.Field
            name="description"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Description</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
              </Form.Item>
            )}
          />
        </Sheet.Content>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Cancel
            </Button>
          </Sheet.Close>
          <Button type="submit" disabled={loading}>
            <Spinner show={loading} />
            Save
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
