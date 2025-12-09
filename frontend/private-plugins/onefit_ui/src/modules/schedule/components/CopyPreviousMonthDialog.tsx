import { Button, Dialog, Form, Input, Select, Spinner } from 'erxes-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCopyPreviousMonthTemplate } from '../hooks/useScheduleMutations';
import { SelectProvider } from '~/modules/provider/components/SelectProvider';
import { copyPreviousMonthSchema } from '../schemas/scheduleSchemas';
import {
  MONTHS,
  getCurrentMonth,
  getCurrentYear,
  getNextMonth,
} from '../utils/scheduleUtils';

type CopyPreviousMonthFormData = z.infer<typeof copyPreviousMonthSchema>;

interface CopyPreviousMonthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export const CopyPreviousMonthDialog = ({
  open,
  onOpenChange,
  onClose,
}: CopyPreviousMonthDialogProps) => {
  const form = useForm<CopyPreviousMonthFormData>({
    resolver: zodResolver(copyPreviousMonthSchema),
    defaultValues: {
      providerIds: [],
      fromYear: getCurrentYear(),
      fromMonth: getCurrentMonth(),
      toYear: getCurrentYear(),
      toMonth: getNextMonth(),
    },
  });

  const { copyPreviousMonth, loading } = useCopyPreviousMonthTemplate();

  const onSubmit = (data: CopyPreviousMonthFormData) => {
    copyPreviousMonth({
      variables: {
        providerIds: data.providerIds,
        fromYear: data.fromYear,
        fromMonth: data.fromMonth,
        toYear: data.toYear,
        toMonth: data.toMonth,
      },
      onCompleted: () => {
        onClose();
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Copy Previous Month Template</Dialog.Title>
        </Dialog.Header>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <Form.Field
              control={form.control}
              name="providerIds"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Providers *</Form.Label>
                  <Form.Control>
                    <SelectProvider
                      selected={field.value || []}
                      onSelect={field.onChange}
                    />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="fromYear"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>From Year *</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        type="number"
                        min="2000"
                        placeholder="Enter year"
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : 2000,
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
                name="fromMonth"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>From Month *</Form.Label>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) =>
                        field.onChange(parseInt(value, 10))
                      }
                    >
                      <Form.Control>
                        <Select.Trigger>
                          <Select.Value placeholder="Select month" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {MONTHS.map((month) => (
                          <Select.Item
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="toYear"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>To Year *</Form.Label>
                    <Form.Control>
                      <Input
                        {...field}
                        type="number"
                        min="2000"
                        placeholder="Enter year"
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value, 10)
                              : 2000,
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
                name="toMonth"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>To Month *</Form.Label>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) =>
                        field.onChange(parseInt(value, 10))
                      }
                    >
                      <Form.Control>
                        <Select.Trigger>
                          <Select.Value placeholder="Select month" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        {MONTHS.map((month) => (
                          <Select.Item
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    <Form.Message />
                  </Form.Item>
                )}
              />
            </div>
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
                Copy Template
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
