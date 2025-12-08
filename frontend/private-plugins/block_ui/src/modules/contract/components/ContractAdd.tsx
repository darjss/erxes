import {
  Button,
  Sheet,
  Spinner,
  Form,
  ScrollArea,
  Select,
  Input,
  Separator,
  useQueryState,
  CurrencyField,
  CurrencyCode,
  DatePicker,
  toast,
  Checkbox,
} from 'erxes-ui';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useCreateContract } from '@/contract/hooks/useManageContract';
import { useForm } from 'react-hook-form';
import {
  ContractFormData,
  contractSchema,
} from '@/contract/constants/contractSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectCustomer, SelectCompany } from 'ui-modules';
import {
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_AMOUNT_TYPE_OPTIONS,
  CONTRACT_PARTY_TYPE_OPTIONS,
} from '@/contract/constants/contract';
import { PaymentPlanForm } from '@/pricing/components/PaymentPlanForm';
import { format } from 'date-fns';
import { ContractUnit } from './ContractUnit';

export const ContractAddSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Sheet.Trigger asChild>
        <Button variant="secondary">
          <IconPlus />
          Add contract
        </Button>
      </Sheet.Trigger>
      <Sheet.View className="blk:sm:max-w-5xl blk:md:w-[calc(100vw-(--spacing(4)))]">
        <Sheet.Header>
          <Sheet.Title>Add contract</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <ContractAddForm onClose={() => setOpen(false)} />
      </Sheet.View>
    </Sheet>
  );
};

export const ContractAddForm = ({ onClose }: { onClose: () => void }) => {
  const [unitId] = useQueryState<string>('unitId');

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      unit: unitId || '',
      status: 'draft',
      party: {
        type: 'customer',
        id: '',
      },
      currency: CurrencyCode.MNT,
    },
  });

  const { createContract, loading } = useCreateContract();

  const handleSubmit = (data: ContractFormData) => {
    createContract({
      variables: {
        input: {
          unit: unitId || data.unit,
          number:
            data.number ||
            `${format(new Date(), 'yyMMddHHmmss').replace(/^0+/g, '')}`,
          currency: data.currency,
          date: data.date || new Date().toISOString(),
          amount: data.amount,
          amountType: data.amountType,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          isLifeTime: data.isLifeTime,
          party: data.party
            ? {
                type: data.party.type,
                id: data.party.id,
              }
            : undefined,
          paymentPlan: data.paymentPlan,
        },
      },
      refetchQueries: ['BlockGetContracts'],
      onCompleted: () => {
        toast({
          title: 'Contract created successfully',
          variant: 'success',
        });
        onClose();
        form.reset();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const partyType = form.watch('party.type');

  return (
    <Form {...form}>
      <form
        className="flex-auto flex flex-col overflow-hidden"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Sheet.Content className="flex-auto overflow-hidden">
          <ScrollArea className="h-full">
            <ContractUnit />
            <div className="grid grid-cols-4 gap-5 p-5">
              <Form.Field
                name="number"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Contract Number</Form.Label>
                    <Input {...field} placeholder="Auto-generated if empty" />
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="status"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Status</Form.Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Form.Control>
                        <Select.Trigger className="h-8">
                          <Select.Value placeholder="Select status" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {CONTRACT_STATUS_OPTIONS.map((option) => (
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

              <Separator className="col-span-4" />
              <PaymentPlanForm form={form} />
              <Separator className="col-span-4" />
              <Form.Field
                name="date"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Contract Date</Form.Label>
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
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="startDate"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      placeholder="Select start date"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        const dateValue = Array.isArray(date) ? date[0] : date;
                        field.onChange(
                          dateValue ? dateValue.toISOString() : undefined,
                        );
                      }}
                    />
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="endDate"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                      placeholder="Select end date"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        const dateValue = Array.isArray(date) ? date[0] : date;
                        field.onChange(
                          dateValue ? dateValue.toISOString() : undefined,
                        );
                      }}
                    />
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="isLifeTime"
                render={({ field }) => (
                  <Form.Item className="flex flex-row items-center space-x-3 space-y-0 mt-4">
                    <Form.Control>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Form.Control>
                    <Form.Label variant="peer">Lifetime Contract</Form.Label>
                  </Form.Item>
                )}
              />
              <Separator className="col-span-4" />
              <Form.Field
                name="party.type"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Party Type</Form.Label>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('party.id', '');
                      }}
                      value={field.value}
                    >
                      <Form.Control>
                        <Select.Trigger className="h-8">
                          <Select.Value placeholder="Select party type" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {CONTRACT_PARTY_TYPE_OPTIONS.map((option) => (
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
                name="party.id"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Party</Form.Label>
                    <Form.Control>
                      {partyType === 'customer' ? (
                        <SelectCustomer.FormItem
                          value={field.value}
                          onValueChange={field.onChange}
                          mode="single"
                        />
                      ) : (
                        <SelectCompany
                          value={field.value}
                          onValueChange={field.onChange}
                          mode="single"
                        />
                      )}
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Separator className="col-span-4" />
              <Form.Field
                name="currency"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Currency</Form.Label>
                    <CurrencyField.SelectCurrency
                      value={field.value as CurrencyCode}
                      onChange={(value) =>
                        field.onChange(value as CurrencyCode)
                      }
                    />
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="amount"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Amount</Form.Label>
                    <CurrencyField.ValueInput
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                name="amountType"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Amount Type</Form.Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <Form.Control>
                        <Select.Trigger className="h-8">
                          <Select.Value placeholder="Select amount type" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {CONTRACT_AMOUNT_TYPE_OPTIONS.map((option) => (
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
            </div>
          </ScrollArea>
        </Sheet.Content>
        <Sheet.Footer className="flex-none">
          <Sheet.Close asChild>
            <Button variant="secondary" className="bg-border">
              Cancel
            </Button>
          </Sheet.Close>
          <Button type="submit" disabled={loading}>
            <Spinner show={loading} />
            Add contract
          </Button>
        </Sheet.Footer>
      </form>
    </Form>
  );
};
