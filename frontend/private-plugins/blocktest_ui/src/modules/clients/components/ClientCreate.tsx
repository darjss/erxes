import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus } from '@tabler/icons-react';
import { Button, Form, Input, Sheet } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const ClientCreateSheet = () => {
  return (
    <Sheet>
      <Sheet.Trigger asChild>
        <Button>
          <IconPlus />
          Create client
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="p-0 sm:max-w-5xl">
        <Sheet.Header>
          <Sheet.Title>Create client</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <ClientCreateForm />
      </Sheet.View>
    </Sheet>
  );
};

const ClientCreateForm = () => {
  const form = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({ name: z.string().min(1, { message: 'Name is required' }) }),
    ),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: { name: string }) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-auto"
      >
        <Sheet.Content className="flex-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Name</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Name</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
        </Sheet.Content>
        <Sheet.Footer>
          <Button type="submit">Create</Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};

// "input": {
//     "bor_file": null,
//     "business_category": null,
//     "business_type": null,
//     "claim_history_file": null,
//     "client_type": null,
//     "contacts": [
//       {
//         "email": null,
//         "name": null,
//         "phone_number": null,
//         "position": null
//       }
//     ],
//     "cvh_broker": null,
//     "description": null,
//     "existing_insurance_policies": null,
//     "insurance_types": null,
//     "isActive": null,
//     "lead_source": null,
//     "operational_address": null,
//     "registered_date": null,
//     "registration_number": null,
//     "service_agreement_file": null,
//     "status": null
//   }
