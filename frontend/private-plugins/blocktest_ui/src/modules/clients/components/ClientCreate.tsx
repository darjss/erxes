import { zodResolver } from '@hookform/resolvers/zod';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  Button,
  Editor,
  Form,
  InfoCard,
  Input,
  Switch,
  ScrollArea,
  Select,
  Sheet,
  DatePicker,
  Separator,
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from 'erxes-ui';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { clientFormSchema } from '../constants/clientFormSchema';
import {
  CLIENT_BUSINESS_MAIN_TYPE_OPTIONS,
  CLIENT_TYPE_OPTIONS,
} from '../constants/clientTypes';
import { SelectMember } from 'ui-modules';
import { ClientAttachment } from './ClientAttachment';

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
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      business_category: '',
      business_type: '',
      claim_history_file: '',
      client_type: '',
      contacts: [],
      cvh_broker: '',
      description: '',
      existing_insurance_policies: '',
    },
  });

  const onSubmit = (data: z.infer<typeof clientFormSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-auto overflow-hidden"
      >
        <Sheet.Content className="flex-auto overflow-hidden">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 gap-6 p-6">
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
                name="client_type"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Client Type</Form.Label>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <Form.Control>
                        <Select.Trigger>
                          <Select.Value placeholder="Select Client Type" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {CLIENT_TYPE_OPTIONS.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="business_category"
                render={({ field }) => (
                  <Form.Item className="col-start-1">
                    <Form.Label>Business Category</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Business Type</Form.Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <Form.Control>
                        <Select.Trigger>
                          <Select.Value placeholder="Select Business Type" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {CLIENT_BUSINESS_MAIN_TYPE_OPTIONS.map((option) => (
                          <Select.Item key={option.value} value={option.value}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    <Form.Message />
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="registration_number"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Registration Number</Form.Label>
                    <Input {...field} />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="registered_date"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Registration Date</Form.Label>
                    <DatePicker
                      placeholder="Select date"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        const dateValue = Array.isArray(date) ? date[0] : date;
                        field.onChange(
                          dateValue ? dateValue.toISOString() : undefined,
                        );
                      }}
                    />
                  </Form.Item>
                )}
              />
              <InfoCard title="Contacts" className="col-span-2">
                <InfoCard.Content>
                  <ClientContacts form={form} />
                </InfoCard.Content>
              </InfoCard>

              <Separator className="col-span-2" />

              <Form.Field
                control={form.control}
                name="cvh_broker"
                render={({ field }) => (
                  <Form.Item className="col-start-1">
                    <Form.Label>CVH Broker</Form.Label>
                    <SelectMember.FormItem
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="insurance_types"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Insurance Types</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Form.Item>
                    <div className="flex items-center gap-2">
                      <Form.Control>
                        <Switch
                          checked={field.value === 'active'}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'active' : 'inactive')
                          }
                        />
                      </Form.Control>
                      <Form.Label>Status</Form.Label>
                    </div>
                    <Form.Message />
                  </Form.Item>
                )}
              />

              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Form.Item className="col-span-2">
                    <Form.Label>Description</Form.Label>
                    <Editor {...field} />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="existing_insurance_policies"
                render={({ field }) => (
                  <Form.Item className="col-span-2">
                    <Form.Label>Existing Insurance Policies</Form.Label>
                    <Editor {...field} />
                  </Form.Item>
                )}
              />
              <Separator className="col-span-2" />
              <Form.Field
                control={form.control}
                name="bor_file"
                render={({ field }) => (
                  <Form.Item>
                    <ClientAttachment
                      attachment={field.value || ''}
                      label="BOR File"
                    />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="claim_history_file"
                render={({ field }) => (
                  <Form.Item>
                    <ClientAttachment
                      attachment={field.value || ''}
                      label="Claim History File"
                    />
                  </Form.Item>
                )}
              />
            </div>
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer>
          <Button type="submit">Create</Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};

const ClientContacts = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof clientFormSchema>>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-end">
          <div className="grid grid-cols-4 gap-4 flex-1">
            <Form.Field
              control={form.control}
              name={`contacts.${index}.name`}
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
              name={`contacts.${index}.email`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Email</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name={`contacts.${index}.phone_number`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name={`contacts.${index}.position`}
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Position</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="text-destructive bg-destructive/10 hover:bg-destructive/20 size-8"
            size="icon"
            onClick={() => remove(index)}
          >
            <IconTrash />
          </Button>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({ name: '', email: '', phone_number: '', position: '' })
          }
        >
          <IconPlus />
          Add Contact
        </Button>
      </div>
    </div>
  );
};
